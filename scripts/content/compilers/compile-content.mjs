import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  ARTIFACT_FILES,
  CONTENT_SCHEMA_VERSION,
  GENERATED_NOTICE,
  INTERVIEW_DIFFICULTIES,
  LEARNING_LEVELS,
  createContentConfig,
} from '../config.mjs';
import { DiagnosticBag } from '../diagnostics.mjs';
import { parseFrontmatter } from '../parsers/frontmatter.mjs';
import { normalizeHeading, parseMarkdownDocument, slugify } from '../parsers/markdown.mjs';
import {
  documentKind,
  validateInterviewDocument,
  validateLessonDocument,
  validateRoadmapDocument,
  validateRubric,
} from '../validators/schema.mjs';
import { validateRelationships } from '../validators/relationships.mjs';
import {
  pathExists,
  readJsonIfPresent,
  relativePath,
  walkMarkdownFiles,
} from '../utilities/files.mjs';

const levelOrder = new Map(LEARNING_LEVELS.map((level, index) => [level, index]));

export async function compileKnowledge(overrides = {}) {
  const config = createContentConfig(overrides);
  const diagnostics = new DiagnosticBag();
  if (!(await pathExists(config.knowledgeRoot))) {
    diagnostics.error(
      'knowledge.missing',
      `Không tìm thấy authoring root: ${relativePath(config.projectRoot, config.knowledgeRoot)}.`,
    );
    return emptyResult(config, diagnostics);
  }

  const officialDomains = await loadOfficialDomains(config, diagnostics);
  const files = await walkMarkdownFiles(config.knowledgeRoot);
  if (!files.length) diagnostics.error('knowledge.empty', 'Không tìm thấy knowledge/**/*.md.');

  const documents = [];
  for (const absoluteFile of files) {
    const file = relativePath(config.projectRoot, absoluteFile);
    const source = await fs.readFile(absoluteFile, 'utf8');
    const { metadata, markdown } = parseFrontmatter(source, file, diagnostics);
    const parsed = parseMarkdownDocument(markdown, { file, diagnostics });
    documents.push({ absoluteFile, file, metadata, markdown, parsed, kind: documentKind(metadata) });
  }

  const context = {
    diagnostics,
    officialDomains,
    reviewReferenceDate: overrides.reviewReferenceDate ?? new Date(),
  };
  const lessons = [];
  const interviews = [];
  const roadmaps = [];
  const documentIdentities = [];

  for (const document of documents) {
    documentIdentities.push({
      id: document.metadata.id,
      slug:
        document.kind === 'lesson'
          ? document.metadata.slug
          : document.kind === 'roadmap'
            ? document.metadata.slug
            : undefined,
      file: document.file,
    });
    if (document.kind === 'lesson') {
      const metadata = validateLessonDocument(document, context);
      const data = compileLesson(metadata, document.parsed);
      lessons.push({ file: document.file, data, parsed: document.parsed });
    } else if (document.kind === 'interview') {
      const data = validateInterviewDocument(document, context);
      interviews.push({ file: document.file, data, parsed: document.parsed });
    } else {
      const data = validateRoadmapDocument(document, context);
      roadmaps.push({ file: document.file, data, parsed: document.parsed });
    }
  }

  for (const lesson of lessons) {
    const embeddedInterviews = compileEmbeddedInterviews(lesson, context);
    interviews.push(...embeddedInterviews);
    documentIdentities.push(
      ...embeddedInterviews.map((interview) => ({
        id: interview.data.id,
        slug: undefined,
        file: interview.file,
      })),
    );
  }

  validateRelationships({ lessons, interviews, roadmaps, documentIdentities }, diagnostics);
  attachInterviewCompatibility(interviews, lessons);

  const flashcards = compileFlashcards(lessons, interviews, diagnostics);
  const sortedLessons = lessons.map((entry) => entry.data).sort(compareLessons);
  const sortedInterviews = interviews.map((entry) => entry.data).sort(compareInterviews);
  const sortedRoadmaps = roadmaps.map((entry) => entry.data).sort((a, b) => a.id.localeCompare(b.id));
  attachLessonNavigation(sortedLessons, sortedRoadmaps);
  const searchIndex = compileSearchIndex(sortedLessons);
  const stats = compileStats(
    sortedLessons,
    sortedInterviews,
    flashcards,
    diagnostics,
  );
  const manifest = compileManifest(sortedLessons, sortedInterviews, flashcards, sortedRoadmaps);
  diagnostics.info(
    'content.summary',
    `Compiled ${sortedLessons.length} lessons, ${sortedInterviews.length} interview questions, ${flashcards.length} flashcards and ${sortedRoadmaps.length} roadmaps.`,
  );

  return {
    config,
    diagnostics,
    artifacts: {
      'lessons.json': sortedLessons,
      'interview.json': sortedInterviews,
      'flashcards.json': flashcards,
      'search-index.json': searchIndex,
      'roadmaps.json': sortedRoadmaps,
      'manifest.json': manifest,
      'content-stats.json': stats,
    },
  };
}

function compileLesson(metadata, parsed) {
  const category = String(metadata.category ?? '');
  const pathName = ['architecture', 'distributed-systems', 'system-design'].includes(category)
    ? `/${category}/${metadata.slug}`
    : `/learn/${category}/${metadata.slug}`;
  return {
    ...metadata,
    previous: '',
    next: metadata.next ?? '',
    path: pathName,
    headings: parsed.headings,
    toc: parsed.headings,
    blocks: parsed.blocks,
    searchText: parsed.searchText,
  };
}

function attachLessonNavigation(lessons, roadmaps) {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const roadmapOwner = new Map();

  // Roadmaps are sorted by ID before this function; the first one owns an overlapping lesson.
  // Sequencing only owned members keeps every generated previous/next pair reciprocal.
  for (const roadmap of roadmaps) {
    for (const { lessonId } of roadmap.steps) {
      if (lessonById.has(lessonId) && !roadmapOwner.has(lessonId)) {
        roadmapOwner.set(lessonId, roadmap.id);
      }
    }
  }

  for (const roadmap of roadmaps) {
    const ids = [...new Set(roadmap.steps
      .map((step) => step.lessonId)
      .filter((id) => roadmapOwner.get(id) === roadmap.id))];
    for (const [index, id] of ids.entries()) {
      const lesson = lessonById.get(id);
      lesson.previous = ids[index - 1] ?? '';
      lesson.next = ids[index + 1] ?? '';
    }
  }

  const groups = new Map();
  for (const lesson of lessons.filter((item) => !roadmapOwner.has(item.id))) {
    const key = `${lesson.technology}\u0000${lesson.level}`;
    const group = groups.get(key) ?? [];
    group.push(lesson);
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    group.sort((left, right) => Number(left.order) - Number(right.order) || left.id.localeCompare(right.id));
    group.forEach((lesson, index) => {
      lesson.previous = group[index - 1]?.id ?? '';
      lesson.next = group[index + 1]?.id ?? '';
    });
  }
}

function compileEmbeddedInterviews(lesson, context) {
  const result = [];
  for (const block of lesson.parsed.structuredBlocks.filter(
    (item) => item.kind === 'interview' && item.data,
  )) {
    const data = block.data ?? {};
    const file = lesson.file;
    for (const field of ['id', 'difficulty', 'question', 'answer30s', 'answerDetailed']) {
      if (!data[field]) {
        context.diagnostics.error('interview.embedded-field', `Embedded interview thiếu ${field}.`, file);
      }
    }
    if (!INTERVIEW_DIFFICULTIES.includes(data.difficulty)) {
      context.diagnostics.error(
        'interview.embedded-difficulty',
        `Embedded interview difficulty không hợp lệ: ${data.difficulty ?? ''}.`,
        file,
      );
    }
    const rubricInput = data.rubric ?? {
      concepts: [
        ...(data.mustInclude ?? []).map((value) => ({
          id: slugify(value),
          required: true,
          aliases: [value],
          points: {},
        })),
        ...(data.strongAnswerIncludes ?? []).map((value) => ({
          id: slugify(value),
          required: false,
          aliases: [value],
          points: {},
        })),
      ],
      misconceptions: data.misconceptions ?? [],
    };
    const rubric = validateRubric(rubricInput, { sections: {} }, file, context.diagnostics);
    result.push({
      file: `${file}#${data.id ?? 'embedded-interview'}`,
      data: {
        id: data.id,
        technology: data.technology ?? lesson.data.technology,
        category: data.category ?? lesson.data.category,
        difficulty: data.difficulty,
        topics: data.topics ?? lesson.data.tags ?? [],
        question: data.question ?? '',
        answer30s: data.answer30s ?? '',
        answerDetailed: data.answerDetailed ?? data.answer2m ?? '',
        answer2m: data.answerDetailed ?? data.answer2m ?? '',
        production: data.production ?? '',
        tradeoffs: data.tradeoffs ?? '',
        wrongAnswer: data.wrongAnswer ?? '',
        followUps: data.followUps ?? [],
        relatedLessons: [lesson.data.id],
        sources: lesson.data.sources,
        rubric,
      },
      parsed: { sections: {} },
    });
  }
  return result;
}

function attachInterviewCompatibility(interviews, lessons) {
  const lessonById = new Map(lessons.map((entry) => [entry.data.id, entry.data]));
  for (const interview of interviews) {
    const relatedLessonLinks = (interview.data.relatedLessons ?? [])
      .map((id) => lessonById.get(id))
      .filter(Boolean)
      .map((lesson) => ({ id: lesson.id, title: lesson.title, path: lesson.path }));
    interview.data.relatedLessonLinks = relatedLessonLinks;
    const firstRelated = interview.data.relatedLessons?.[0];
    interview.data.relatedLesson = firstRelated
      ? (lessonById.get(firstRelated)?.path ?? firstRelated)
      : '';
  }
}

function compileFlashcards(lessons, interviews, diagnostics) {
  const manual = [];
  const derived = [];
  for (const lesson of lessons) {
    for (const block of lesson.parsed.structuredBlocks.filter((item) => item.kind === 'flashcard')) {
      const data = block.data ?? {};
      const front = data.front ?? data.question;
      const back = data.back ?? data.answer;
      for (const [field, value] of Object.entries({ id: data.id, front, back })) {
        if (typeof value !== 'string' || !value.trim()) {
          diagnostics.error('flashcard.field', `Manual flashcard thiếu ${field}.`, lesson.file);
        }
      }
      manual.push({
        id: data.id,
        technology: data.technology ?? lesson.data.technology,
        category: data.category ?? lesson.data.category,
        level: data.level ?? lesson.data.level,
        difficulty: data.difficulty,
        front: String(front ?? ''),
        back: String(back ?? ''),
        sourceLesson: lesson.data.id,
        sourcePath: lesson.data.path,
        tags: data.tags ?? lesson.data.tags ?? [],
        generated: false,
      });
    }

    const takeaways = sectionItems(lesson.parsed, ['key takeaways', 'diem can nho']);
    for (const [index, takeaway] of takeaways.entries()) {
      derived.push({
        id: `derived-${lesson.data.id}-takeaway-${index + 1}`,
        technology: lesson.data.technology,
        category: lesson.data.category,
        level: lesson.data.level,
        front: `Điểm cần nhớ ${index + 1} của “${lesson.data.title}” là gì?`,
        back: takeaway,
        sourceLesson: lesson.data.id,
        sourcePath: lesson.data.path,
        tags: lesson.data.tags ?? [],
        generated: true,
      });
    }

    for (const block of lesson.parsed.structuredBlocks.filter((item) => item.kind === 'glossary')) {
      const data = block.data ?? {};
      if (!data.term || !data.definition) {
        diagnostics.error('glossary.field', 'Glossary block cần term và definition.', lesson.file);
        continue;
      }
      derived.push({
        id: `derived-${lesson.data.id}-glossary-${slugify(data.term)}`,
        technology: lesson.data.technology,
        category: lesson.data.category,
        level: lesson.data.level,
        front: `${data.term} là gì?`,
        back: String(data.definition),
        sourceLesson: lesson.data.id,
        sourcePath: lesson.data.path,
        tags: [...new Set([...(lesson.data.tags ?? []), slugify(data.term)])],
        generated: true,
      });
    }
  }

  const lessonById = new Map(lessons.map((entry) => [entry.data.id, entry.data]));
  for (const interview of interviews) {
    const sourceLesson = interview.data.relatedLessons?.[0] ?? '';
    const lesson = lessonById.get(sourceLesson);
    derived.push({
      id: `derived-interview-${interview.data.id}`,
      technology: interview.data.technology,
      category: interview.data.category,
      level: lesson?.level ?? inferLevelFromDifficulty(interview.data.difficulty),
      difficulty: interview.data.difficulty,
      front: interview.data.question,
      back: interview.data.answer30s,
      sourceLesson,
      sourcePath: lesson?.path ?? '',
      tags: interview.data.topics ?? [],
      generated: true,
    });
  }

  const manualConcepts = new Set(manual.map((card) => normalizeCardFront(card.front)));
  const cards = [...manual, ...derived.filter((card) => !manualConcepts.has(normalizeCardFront(card.front)))];
  const ids = new Map();
  const concepts = new Map();
  const deduplicated = [];
  for (const card of cards) {
    const previousId = ids.get(card.id);
    if (previousId) {
      diagnostics.error('flashcard.duplicate-id', `Flashcard ID bị lặp: ${card.id}.`, previousId);
      continue;
    }
    ids.set(card.id, card.sourceLesson);
    const concept = normalizeCardFront(card.front);
    if (concepts.has(concept)) {
      diagnostics.warning('flashcard.duplicate-concept', `Bỏ flashcard trùng ý: ${card.id}.`, card.sourceLesson);
      continue;
    }
    concepts.set(concept, card.id);
    deduplicated.push(card);
  }
  return deduplicated.sort(compareFlashcards);
}

function compileSearchIndex(lessons) {
  return lessons
    .map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      technology: lesson.technology,
      domain: lesson.domain,
      category: lesson.category,
      level: lesson.level,
      contentType: lesson.contentType,
      tags: lesson.tags ?? [],
      aliases: lesson.aliases ?? [],
      headings: lesson.headings.map((heading) => heading.text),
      content: lesson.searchText,
      path: lesson.path,
    }))
    .sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
}

function compileStats(lessons, interviews, flashcards, diagnostics) {
  return {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    totalLessons: lessons.length,
    byTechnology: countBy(lessons, (lesson) => lesson.technology),
    byLevel: countBy(lessons, (lesson) => lesson.level),
    byContentType: countBy(lessons, (lesson) => lesson.contentType),
    interviewQuestionCount: interviews.length,
    flashcardCount: flashcards.length,
    sourceCount: new Set(
      [...lessons, ...interviews].flatMap((item) => item.sources ?? []).map((source) => source.url),
    ).size,
    warningCount: diagnostics.warnings.length,
    warnings: diagnostics.warnings,
  };
}

function compileManifest(lessons, interviews, flashcards, roadmaps) {
  return {
    notice: GENERATED_NOTICE,
    schemaVersion: CONTENT_SCHEMA_VERSION,
    artifacts: [...ARTIFACT_FILES],
    counts: {
      lessons: lessons.length,
      interviewQuestions: interviews.length,
      flashcards: flashcards.length,
      roadmaps: roadmaps.length,
    },
    technologies: [...new Set(lessons.map((lesson) => lesson.technology))].sort(),
    levels: [...LEARNING_LEVELS],
    contentTypes: [...new Set(lessons.map((lesson) => lesson.contentType))].sort(),
  };
}

async function loadOfficialDomains(config, diagnostics) {
  let registry;
  const registryPath = config.sourceRegistryPath;
  try {
    registry = await readJsonIfPresent(registryPath);
  } catch (error) {
    diagnostics.error(
      'source.registry-json',
      `Official-source registry JSON không hợp lệ: ${error instanceof Error ? error.message : String(error)}.`,
      relativePath(config.projectRoot, registryPath),
    );
    return new Set();
  }
  if (registry === undefined) {
    diagnostics.warning('source.registry-missing', 'Không tìm thấy official-source registry.');
    return new Set();
  }
  const entries = Array.isArray(registry) ? registry : (registry.entries ?? []);
  const domains = new Set(
    entries
      .flatMap((entry) => entry.domains ?? [])
      .map((domain) => String(domain).trim().toLowerCase())
      .filter(Boolean),
  );
  if (!domains.size) diagnostics.error('source.registry-empty', 'Official-source registry không có domain.');
  return domains;
}

function sectionItems(parsed, aliases) {
  for (const alias of aliases) {
    const section = parsed.sections[normalizeHeading(alias)];
    if (section) return section.items;
  }
  return [];
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const key = String(selector(item));
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function compareLessons(left, right) {
  return (
    String(left.technology).localeCompare(String(right.technology)) ||
    (levelOrder.get(left.level) ?? 99) - (levelOrder.get(right.level) ?? 99) ||
    Number(left.order) - Number(right.order) ||
    String(left.id).localeCompare(String(right.id))
  );
}

function compareInterviews(left, right) {
  return (
    String(left.technology).localeCompare(String(right.technology)) ||
    String(left.category).localeCompare(String(right.category)) ||
    String(left.difficulty).localeCompare(String(right.difficulty)) ||
    String(left.id).localeCompare(String(right.id))
  );
}

function compareFlashcards(left, right) {
  return (
    String(left.technology).localeCompare(String(right.technology)) ||
    (levelOrder.get(left.level) ?? 99) - (levelOrder.get(right.level) ?? 99) ||
    String(left.id).localeCompare(String(right.id))
  );
}

function normalizeCardFront(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function inferLevelFromDifficulty(difficulty) {
  if (difficulty === 'junior') return 'basic';
  if (difficulty === 'middle') return 'advanced';
  return 'extended';
}

function emptyResult(config, diagnostics) {
  return {
    config,
    diagnostics,
    artifacts: Object.fromEntries(
      ARTIFACT_FILES.map((file) => [file, file.endsWith('stats.json') || file === 'manifest.json' ? {} : []]),
    ),
  };
}
