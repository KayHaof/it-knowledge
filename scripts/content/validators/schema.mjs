import {
  CONTENT_TYPES,
  INTERVIEW_DIFFICULTIES,
  LEARNING_LEVELS,
  LEGACY_SOURCE_TYPE_ALIASES,
  REQUIRED_LESSON_FIELDS,
  SOURCE_TYPES,
} from '../config.mjs';
import { normalizeHeading, slugify } from '../parsers/markdown.mjs';

const learningLevels = new Set(LEARNING_LEVELS);
const contentTypes = new Set(CONTENT_TYPES);
const interviewDifficulties = new Set(INTERVIEW_DIFFICULTIES);
const sourceTypes = new Set(SOURCE_TYPES);
const stableIdentityPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_RUBRIC_DIMENSIONS = Object.freeze({
  technicalCorrectness: 40,
  completeness: 20,
  reasoning: 15,
  production: 10,
  tradeoffs: 10,
  communication: 5,
});
const RUNTIME_RUBRIC_DIMENSION_KEYS = Object.freeze(Object.keys(DEFAULT_RUBRIC_DIMENSIONS));

export function documentKind(metadata) {
  if (metadata.type === 'interview-question') return 'interview';
  if (metadata.type === 'roadmap') return 'roadmap';
  return 'lesson';
}

export function validateLessonDocument(document, context) {
  const { metadata, parsed, file } = document;
  const { diagnostics, officialDomains } = context;
  for (const field of REQUIRED_LESSON_FIELDS) requireField(metadata, field, file, diagnostics);
  if (metadata.type !== undefined && metadata.type !== 'lesson') {
    diagnostics.error('schema.type', `Lesson type phải là \`lesson\` hoặc được bỏ trống.`, file);
  }
  validateStableIdentity(metadata.id, 'id', file, diagnostics);
  validateStableIdentity(metadata.slug, 'slug', file, diagnostics);
  if (!learningLevels.has(metadata.level)) {
    diagnostics.error(
      'lesson.level',
      `level phải là một trong: ${LEARNING_LEVELS.join(', ')}; nhận \`${metadata.level}\`.`,
      file,
    );
  }
  if (!contentTypes.has(metadata.contentType)) {
    diagnostics.error(
      'lesson.content-type',
      `contentType phải là một trong: ${CONTENT_TYPES.join(', ')}; nhận \`${metadata.contentType}\`.`,
      file,
    );
  }
  validatePositiveNumber(metadata.order, 'order', file, diagnostics, { allowZero: true });
  validatePositiveNumber(metadata.estimatedMinutes, 'estimatedMinutes', file, diagnostics);
  validateStringArray(metadata.tags, 'tags', file, diagnostics, { nonEmpty: true });
  validateStringArray(metadata.learningObjectives, 'learningObjectives', file, diagnostics, {
    nonEmpty: true,
  });
  validateStringArray(metadata.prerequisites ?? [], 'prerequisites', file, diagnostics);
  validateStringArray(metadata.related ?? [], 'related', file, diagnostics);
  if (metadata.aliases !== undefined) validateStringArray(metadata.aliases, 'aliases', file, diagnostics);
  if (metadata.authors !== undefined) validateStringArray(metadata.authors, 'authors', file, diagnostics);
  if (metadata.appliesTo !== undefined && !isStringRecord(metadata.appliesTo)) {
    diagnostics.error('schema.applies-to', 'appliesTo phải là mapping chuỗi -> chuỗi.', file);
  }
  if (metadata.deprecated !== undefined && typeof metadata.deprecated !== 'boolean') {
    diagnostics.error('schema.deprecated', 'deprecated phải là boolean.', file);
  }
  if (metadata.replacedBy !== undefined) {
    validateStableIdentity(metadata.replacedBy, 'replacedBy', file, diagnostics);
  }
  validateDate(metadata.lastReviewed, file, diagnostics, context.reviewReferenceDate);
  const sources = validateSources(metadata.sources, file, diagnostics, officialDomains);

  if (!parsed.searchText.trim()) diagnostics.error('markdown.empty', 'Lesson body đang trống.', file);
  const lessonH1Count = parsed.allHeadings.filter((heading) => heading.depth === 1).length;
  if (lessonH1Count !== 1) {
    diagnostics.error('markdown.h1', `Lesson phải có đúng một H1 title; nhận ${lessonH1Count}.`, file);
  } else if (metadata.title && normalizeText(parsed.title) !== normalizeText(metadata.title)) {
    diagnostics.warning('markdown.title-mismatch', 'H1 khác với front matter title.', file);
  }
  validateRequiredLessonSections(parsed, file, diagnostics);

  return {
    ...metadata,
    prerequisites: metadata.prerequisites ?? [],
    related: metadata.related ?? [],
    aliases: metadata.aliases ?? [],
    sources,
  };
}

export function validateInterviewDocument(document, context) {
  const { metadata, parsed, file } = document;
  const { diagnostics, officialDomains } = context;
  for (const field of [
    'id',
    'type',
    'technology',
    'category',
    'difficulty',
    'topics',
    'relatedLessons',
    'sources',
  ]) {
    requireField(metadata, field, file, diagnostics);
  }
  validateStableIdentity(metadata.id, 'id', file, diagnostics);
  if (!interviewDifficulties.has(metadata.difficulty)) {
    diagnostics.error(
      'interview.difficulty',
      `difficulty phải là một trong: ${INTERVIEW_DIFFICULTIES.join(', ')}.`,
      file,
    );
  }
  validateStringArray(metadata.topics, 'topics', file, diagnostics, { nonEmpty: true });
  validateStringArray(metadata.relatedLessons, 'relatedLessons', file, diagnostics);
  const sources = validateSources(metadata.sources, file, diagnostics, officialDomains);
  const interviewH1Count = parsed.allHeadings.filter((heading) => heading.depth === 1).length;
  if (interviewH1Count !== 1) {
    diagnostics.error(
      'interview.question',
      `Interview document phải có đúng một H1 question; nhận ${interviewH1Count}.`,
      file,
    );
  }

  const answer30s = sectionText(parsed, ['cau tra loi 30 giay', 'answer 30s']);
  const answerDetailed = sectionText(parsed, [
    'cau tra loi chi tiet',
    'answer detailed',
    'detailed answer',
  ]);
  const production = sectionText(parsed, ['goc nhin production', 'production perspective', 'production']);
  const tradeoffs = sectionText(parsed, ['trade offs', 'tradeoffs']);
  const wrongAnswer = sectionText(parsed, [
    'cau tra loi sai thuong gap',
    'common wrong answer',
    'misconceptions',
  ]);
  const followUps = sectionItems(parsed, ['follow up', 'follow up questions']);
  if (!findSection(parsed, ['rubric'])) {
    diagnostics.error('interview.rubric-section', 'Thiếu section Rubric.', file);
  }
  if (!sectionText(parsed, ['nguon chinh thong', 'official sources'])) {
    diagnostics.error('interview.sources-section', 'Thiếu section Nguồn chính thống.', file);
  }
  for (const [name, value] of Object.entries({
    answer30s,
    answerDetailed,
    production,
    tradeoffs,
    wrongAnswer,
  })) {
    if (!value) diagnostics.error(`interview.${name}`, `Thiếu nội dung ${name}.`, file);
  }
  if (!followUps.length) diagnostics.error('interview.follow-ups', 'Thiếu Follow-up questions.', file);
  const rubric = validateRubric(metadata.rubric, parsed, file, diagnostics);

  return {
    id: metadata.id,
    technology: String(metadata.technology ?? ''),
    category: String(metadata.category ?? ''),
    difficulty: metadata.difficulty,
    topics: metadata.topics ?? [],
    question: parsed.title,
    answer30s,
    answerDetailed,
    answer2m: answerDetailed,
    production,
    tradeoffs,
    wrongAnswer,
    followUps,
    relatedLessons: metadata.relatedLessons ?? [],
    sources,
    rubric,
  };
}

export function validateRoadmapDocument(document, context) {
  const { metadata, parsed, file } = document;
  const { diagnostics } = context;
  for (const field of ['id', 'type', 'title', 'description', 'steps']) {
    requireField(metadata, field, file, diagnostics);
  }
  validateStableIdentity(metadata.id, 'id', file, diagnostics);
  if (!Array.isArray(metadata.steps) || !metadata.steps.length) {
    diagnostics.error('roadmap.steps', 'Roadmap steps phải là mảng không rỗng.', file);
  }
  const steps = (Array.isArray(metadata.steps) ? metadata.steps : []).map((step, index) => {
    if (!step || typeof step !== 'object' || typeof step.lessonId !== 'string' || !step.lessonId) {
      diagnostics.error('roadmap.step', `Step ${index + 1} thiếu lessonId.`, file);
      return { lessonId: '', note: '' };
    }
    if (step.note !== undefined && typeof step.note !== 'string') {
      diagnostics.error('roadmap.step-note', `Step ${index + 1} có note không hợp lệ.`, file);
    }
    return { lessonId: step.lessonId, note: String(step.note ?? '') };
  });
  const roadmapH1Count = parsed.allHeadings.filter((heading) => heading.depth === 1).length;
  if (roadmapH1Count !== 1) {
    diagnostics.error('roadmap.h1', `Roadmap phải có đúng một H1 title; nhận ${roadmapH1Count}.`, file);
  }
  if (!sectionText(parsed, ['tong quan', 'overview'])) {
    diagnostics.error('roadmap.overview', 'Roadmap thiếu section Tổng quan.', file);
  }
  return {
    id: metadata.id,
    slug: metadata.slug ?? metadata.id,
    title: String(metadata.title ?? ''),
    description: String(metadata.description ?? ''),
    technology: metadata.technology ?? '',
    steps,
  };
}

export function validateSources(value, file, diagnostics, officialDomains) {
  if (!Array.isArray(value) || !value.length) {
    diagnostics.error('source.required', 'sources phải là mảng không rỗng.', file);
    return [];
  }
  const seen = new Set();
  return value.map((rawSource, index) => {
    const source = rawSource && typeof rawSource === 'object' ? { ...rawSource } : {};
    for (const field of ['title', 'organization', 'url', 'type']) {
      if (typeof source[field] !== 'string' || !source[field].trim()) {
        diagnostics.error('source.field', `Source ${index + 1} thiếu ${field}.`, file);
      }
    }
    if (LEGACY_SOURCE_TYPE_ALIASES[source.type]) {
      diagnostics.warning(
        'source.legacy-type',
        `Source type \`${source.type}\` được chuẩn hóa thành \`${LEGACY_SOURCE_TYPE_ALIASES[source.type]}\`.`,
        file,
      );
      source.type = LEGACY_SOURCE_TYPE_ALIASES[source.type];
    }
    if (source.type && !sourceTypes.has(source.type)) {
      diagnostics.error('source.type', `Source type không hợp lệ: ${source.type}.`, file);
    }
    try {
      const url = new URL(source.url);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol');
      const hostname = url.hostname.toLowerCase();
      if (
        officialDomains.size &&
        source.type !== 'secondary' &&
        ![...officialDomains].some(
          (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
        )
      ) {
        diagnostics.error('source.domain', `Source domain chưa có trong registry: ${hostname}.`, file);
      }
    } catch {
      diagnostics.error('source.url', `URL không hợp lệ: ${source.url ?? ''}.`, file);
    }
    const duplicateKey = String(source.url).trim().toLowerCase();
    if (seen.has(duplicateKey)) diagnostics.error('source.duplicate', `Source bị lặp: ${source.url}.`, file);
    seen.add(duplicateKey);
    return source;
  });
}

export function validateRubric(rawRubric, parsed, file, diagnostics) {
  const fallbackRequired = sectionItems(parsed, ['must include']);
  const fallbackRecommended = sectionItems(parsed, ['strong answer includes']);
  const rubric = rawRubric && typeof rawRubric === 'object' ? rawRubric : {};
  const hasDimensionObject =
    rubric.dimensions === undefined ||
    (rubric.dimensions !== null &&
      typeof rubric.dimensions === 'object' &&
      !Array.isArray(rubric.dimensions));
  const rawDimensions = hasDimensionObject
    ? (rubric.dimensions ?? DEFAULT_RUBRIC_DIMENSIONS)
    : {};
  const dimensionKeys = Object.keys(rawDimensions);
  const missingDimensions = RUNTIME_RUBRIC_DIMENSION_KEYS.filter(
    (key) => !Object.prototype.hasOwnProperty.call(rawDimensions, key),
  );
  const unexpectedDimensions = dimensionKeys.filter(
    (key) => !RUNTIME_RUBRIC_DIMENSION_KEYS.includes(key),
  );
  if (!hasDimensionObject || missingDimensions.length || unexpectedDimensions.length) {
    const details = [
      missingDimensions.length ? `thiếu: ${missingDimensions.join(', ')}` : '',
      unexpectedDimensions.length ? `không hợp lệ: ${unexpectedDimensions.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('; ');
    diagnostics.error(
      'rubric.dimension-schema',
      `Rubric phải khai báo đúng sáu dimension runtime${details ? ` (${details})` : ''}.`,
      file,
    );
  }
  const dimensions = Object.fromEntries(
    RUNTIME_RUBRIC_DIMENSION_KEYS.map((key) => [key, rubricDimensionWeight(rawDimensions[key])]),
  );
  const dimensionTotal = Object.values(dimensions).reduce((sum, value) => sum + value, 0);
  if (Object.values(dimensions).some((value) => !Number.isFinite(value) || value < 0)) {
    diagnostics.error('rubric.dimensions', 'Rubric dimension weights phải là số không âm.', file);
  } else if (dimensionTotal !== 100) {
    diagnostics.error('rubric.total', `Tổng rubric dimension weights phải bằng 100; nhận ${dimensionTotal}.`, file);
  }

  let concepts = Array.isArray(rubric.concepts) ? rubric.concepts : [];
  if (!concepts.length) {
    concepts = [
      ...fallbackRequired.map((value) => ({ value, required: true })),
      ...fallbackRecommended.map((value) => ({ value, required: false })),
    ].map(({ value, required }, index) => ({
      id: slugify(value) || `concept-${index + 1}`,
      required,
      aliases: [value],
      points: {},
    }));
  }
  concepts = concepts.map((concept, index) => {
    const normalized = concept && typeof concept === 'object' ? concept : {};
    const id = normalized.id ?? `concept-${index + 1}`;
    validateStableIdentity(id, `rubric.concepts[${index}].id`, file, diagnostics);
    validateStringArray(normalized.aliases, `rubric.concepts[${index}].aliases`, file, diagnostics, {
      nonEmpty: true,
    });
    const points = normalized.points && typeof normalized.points === 'object' ? normalized.points : {};
    for (const [dimension, value] of Object.entries(points)) {
      if (!(dimension in dimensions)) {
        diagnostics.error('rubric.dimension-reference', `Concept ${id} dùng dimension lạ: ${dimension}.`, file);
      }
      if (!Number.isFinite(Number(value)) || Number(value) < 0) {
        diagnostics.error('rubric.points', `Concept ${id} có points không hợp lệ.`, file);
      }
    }
    return {
      id,
      required: Boolean(normalized.required),
      aliases: normalized.aliases ?? [],
      points: Object.fromEntries(Object.entries(points).map(([key, value]) => [key, Number(value)])),
    };
  });
  if (!concepts.length) diagnostics.error('rubric.concepts', 'Rubric phải có ít nhất một concept.', file);
  if (concepts.length && concepts.every((concept) => !Object.keys(concept.points).length)) {
    concepts = concepts.map((concept, index) => ({
      ...concept,
      points: {
        technicalCorrectness: distributedPoints(40, concepts.length, index),
        completeness: distributedPoints(20, concepts.length, index),
      },
    }));
  }

  const misconceptions = (Array.isArray(rubric.misconceptions) ? rubric.misconceptions : []).map(
    (misconception, index) => {
      const normalized = misconception && typeof misconception === 'object' ? misconception : {};
      const patterns = normalized.patterns ?? (normalized.pattern ? [normalized.pattern] : []);
      validateStringArray(patterns, `rubric.misconceptions[${index}].patterns`, file, diagnostics, {
        nonEmpty: true,
      });
      const penalty = Number(normalized.penalty);
      if (!Number.isFinite(penalty) || penalty < 0) {
        diagnostics.error('rubric.penalty', `Misconception ${index + 1} có penalty không hợp lệ.`, file);
      }
      return {
        id: normalized.id ?? `misconception-${index + 1}`,
        patterns,
        penalty,
      };
    },
  );
  return { dimensions, concepts, misconceptions };
}

function validateRequiredLessonSections(parsed, file, diagnostics) {
  const required = [
    ['overview', ['tong quan', 'overview']],
    ['key-takeaways', ['key takeaways', 'diem can nho']],
    ['official-sources', ['nguon chinh thong', 'official sources']],
  ];
  for (const [code, aliases] of required) {
    if (!findSection(parsed, aliases)) {
      diagnostics.error('markdown.required-section', `Thiếu section bắt buộc: ${code}.`, file);
    }
  }
}

function findSection(parsed, aliases) {
  return aliases.map(normalizeHeading).map((name) => parsed.sections[name]).find(Boolean);
}

function sectionText(parsed, aliases) {
  return findSection(parsed, aliases)?.text?.trim() ?? '';
}

function sectionItems(parsed, aliases) {
  return findSection(parsed, aliases)?.items ?? [];
}

function requireField(metadata, field, file, diagnostics) {
  const value = metadata[field];
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    diagnostics.error('schema.required', `Thiếu trường bắt buộc \`${field}\`.`, file);
  }
}

function validateStableIdentity(value, field, file, diagnostics) {
  if (typeof value !== 'string' || !stableIdentityPattern.test(value)) {
    diagnostics.error(
      'schema.identity',
      `${field} phải là kebab-case ổn định, không phụ thuộc filename; nhận \`${value ?? ''}\`.`,
      file,
    );
  }
}

function validatePositiveNumber(value, field, file, diagnostics, { allowZero = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || (allowZero ? number < 0 : number <= 0)) {
    diagnostics.error('schema.number', `${field} phải là số ${allowZero ? 'không âm' : 'dương'}.`, file);
  }
}

function validateStringArray(value, field, file, diagnostics, { nonEmpty = false } = {}) {
  if (!Array.isArray(value) || (nonEmpty && value.length === 0)) {
    diagnostics.error('schema.array', `${field} phải là mảng${nonEmpty ? ' không rỗng' : ''}.`, file);
    return;
  }
  if (value.some((item) => typeof item !== 'string' || !item.trim())) {
    diagnostics.error('schema.array-item', `${field} chỉ được chứa chuỗi không rỗng.`, file);
  }
}

function validateDate(value, file, diagnostics, referenceDate = new Date()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    diagnostics.error('schema.last-reviewed', 'lastReviewed phải có dạng YYYY-MM-DD.', file);
    return;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    diagnostics.error('schema.last-reviewed', `lastReviewed không phải ngày hợp lệ: ${value}.`, file);
    return;
  }
  const reference = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const staleAfterDays = 548;
  if (
    !Number.isNaN(reference.valueOf()) &&
    reference.valueOf() - parsed.valueOf() > staleAfterDays * 24 * 60 * 60 * 1000
  ) {
    diagnostics.warning(
      'schema.review-stale',
      `Nội dung chưa được review trong hơn ${staleAfterDays} ngày (lastReviewed: ${value}).`,
      file,
    );
  }
}

function normalizeText(value) {
  return String(value).replace(/[`*_~]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function distributedPoints(total, count, index) {
  const base = Math.floor(total / count);
  return index === count - 1 ? total - base * (count - 1) : base;
}

function rubricDimensionWeight(value) {
  const weight = value && typeof value === 'object' && !Array.isArray(value) ? value.weight : value;
  return typeof weight === 'number' ? weight : Number.NaN;
}

function isStringRecord(value) {
  return (
    value &&
    !Array.isArray(value) &&
    typeof value === 'object' &&
    Object.values(value).every((item) => typeof item === 'string')
  );
}
