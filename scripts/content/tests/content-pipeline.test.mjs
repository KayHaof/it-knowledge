import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { compileKnowledge } from '../compilers/compile-content.mjs';
import { DiagnosticBag } from '../diagnostics.mjs';
import { writeGeneratedArtifacts } from '../generators/artifacts.mjs';
import { parseMarkdownDocument } from '../parsers/markdown.mjs';
import { stableStringify } from '../utilities/files.mjs';

test('parses Markdown through marked, preserves runtime blocks and structured blocks', () => {
  const diagnostics = new DiagnosticBag();
  const parsed = parseMarkdownDocument(
    `# Title

## Tổng quan

Một đoạn **đậm**.

:::note Lưu ý
Nội dung an toàn.
:::

\`\`\`java title="Example.java"
class Example {}
\`\`\`
`,
    { file: 'lesson.md', diagnostics },
  );
  assert.equal(diagnostics.errors.length, 0);
  assert.equal(parsed.title, 'Title');
  assert.ok(parsed.blocks.some((block) => block.type === 'heading'));
  assert.ok(parsed.blocks.some((block) => block.type === 'callout' && block.kind === 'note'));
  assert.ok(
    parsed.blocks.some(
      (block) => block.type === 'code' && block.language === 'java' && block.title === 'Example.java',
    ),
  );
  const plain = parseMarkdownDocument('# Title\n\nĐoạn văn không có inline markup.', {
    file: 'plain.md',
    diagnostics: new DiagnosticBag(),
  });
  assert.equal(plain.blocks.find((block) => block.type === 'paragraph').inline, undefined);
});

test('rejects dangerous raw HTML and unsafe links while allowing Java generic notation', () => {
  const diagnostics = new DiagnosticBag();
  const unsafe = parseMarkdownDocument(
    '# T\n\n[bad](javascript:alert(1))\n\n<script>alert(1)</script>',
    { file: 'unsafe.md', diagnostics },
  );
  assert.ok(diagnostics.errors.some((item) => item.code === 'markdown.raw-html'));
  assert.ok(diagnostics.errors.some((item) => item.code === 'markdown.unsafe-link'));
  assert.equal(
    unsafe.blocks.some((block) => block.inline?.some((segment) => segment.type === 'link')),
    false,
  );
  const generics = new DiagnosticBag();
  parseMarkdownDocument('# T\n\nList<User> và Map<Key, Value>.', {
    file: 'generics.md',
    diagnostics: generics,
  });
  assert.equal(generics.errors.filter((item) => item.code === 'markdown.raw-html').length, 0);
});

test('compiles Markdown links in lesson paragraphs and lists into typed inline runs', async (t) => {
  const project = await createProject(t, {
    'java/basic/inline-links.md': lesson({
      extraBody: `Đọc **[Angular docs](https://docs.example.com/angular "Official guide")** và \`RouterLink\`.

- Mở [guide](https://docs.example.com/guide) trước khi thực hành.

:::note Liên kết tham khảo
Xem [callout guide](https://docs.example.com/callout).
:::

| Tài liệu |
| --- |
| [table guide](https://docs.example.com/table) |`,
    }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.deepEqual(result.diagnostics.errors, []);

  const [compiled] = result.artifacts['lessons.json'];
  const paragraph = compiled.blocks.find(
    (block) => block.type === 'paragraph' && block.text.includes('Angular docs'),
  );
  assert.deepEqual(
    paragraph.inline.find((segment) => segment.type === 'link'),
    {
      type: 'link',
      text: 'Angular docs',
      strong: true,
      code: false,
      href: 'https://docs.example.com/angular',
      title: 'Official guide',
    },
  );
  assert.ok(paragraph.inline.some((segment) => segment.text === 'RouterLink' && segment.code));

  const list = compiled.blocks.find(
    (block) => block.type === 'list' && block.items.some((item) => item.includes('[guide]')),
  );
  assert.deepEqual(list.inlineItems[0].find((segment) => segment.type === 'link'), {
    type: 'link',
    text: 'guide',
    strong: false,
    code: false,
    href: 'https://docs.example.com/guide',
  });

  const callout = compiled.blocks.find(
    (block) => block.type === 'callout' && block.title === 'Liên kết tham khảo',
  );
  assert.equal(callout.inline.find((segment) => segment.type === 'link').href, 'https://docs.example.com/callout');

  const table = compiled.blocks.find((block) => block.type === 'table');
  assert.equal(
    table.inlineRows[0][0].find((segment) => segment.type === 'link').href,
    'https://docs.example.com/table',
  );
  assert.doesNotMatch(compiled.searchText, /https:\/\/docs\.example\.com\/guide/);
});

test('validates and compiles a lesson, interview and roadmap', async (t) => {
  const project = await createProject(t, {
    'java/basic/java-basics.md': lesson(),
    'java/interview/interview-java-basics.md': interview(),
    '_roadmaps/java.md': roadmap(),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.deepEqual(result.diagnostics.errors, []);
  assert.equal(result.artifacts['lessons.json'].length, 1);
  assert.equal(result.artifacts['interview.json'].length, 1);
  assert.equal(result.artifacts['roadmaps.json'].length, 1);
  assert.equal(result.artifacts['interview.json'][0].answer2m, 'Java chạy trên JVM.');
  assert.equal(result.artifacts['interview.json'][0].relatedLesson, '/learn/java/java-basics');
  assert.deepEqual(result.artifacts['interview.json'][0].relatedLessonLinks, [
    { id: 'java-basics', title: 'Java Basics', path: '/learn/java/java-basics' },
  ]);
  assert.equal(result.artifacts['interview.json'][0].rubric.dimensions.technicalCorrectness, 40);
});

test('reports malformed front matter', async (t) => {
  const project = await createProject(t, { 'java/basic/broken.md': '---\nid: [\n---\n# Broken' });
  const result = await compileKnowledge({ projectRoot: project });
  assert.ok(result.diagnostics.errors.some((item) => item.code === 'frontmatter.invalid'));
});

test('reports duplicate IDs and slugs globally', async (t) => {
  const project = await createProject(t, {
    'java/basic/one.md': lesson(),
    'java/advanced/two.md': lesson({ title: 'Other' }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.ok(result.diagnostics.errors.some((item) => item.code === 'identity.duplicate-id'));
  assert.ok(result.diagnostics.errors.some((item) => item.code === 'identity.duplicate-slug'));
});

test('reports embedded interview IDs colliding with every global content kind', async (t) => {
  const cases = [
    {
      label: 'lesson',
      id: 'java-basics',
      documents: {
        'java/basic/java-basics.md': lesson({ extraBody: embeddedInterview('java-basics') }),
      },
    },
    {
      label: 'roadmap',
      id: 'java-roadmap',
      documents: {
        'java/basic/java-basics.md': lesson({ extraBody: embeddedInterview('java-roadmap') }),
        '_roadmaps/java.md': roadmap(),
      },
    },
    {
      label: 'standalone interview',
      id: 'interview-java-basics',
      documents: {
        'java/basic/java-basics.md': lesson({
          extraBody: embeddedInterview('interview-java-basics'),
        }),
        'java/interview/interview-java-basics.md': interview(),
      },
    },
  ];

  for (const scenario of cases) {
    const project = await createProject(t, scenario.documents);
    const result = await compileKnowledge({ projectRoot: project });
    assert.ok(
      result.diagnostics.errors.some(
        (item) => item.code === 'identity.duplicate-id' && item.message.includes(scenario.id),
      ),
      `expected embedded interview collision with ${scenario.label}`,
    );
  }
});

test('requires the exact six numeric nonnegative rubric dimensions totaling 100', async (t) => {
  const validDimensions = {
    technicalCorrectness: 40,
    completeness: 20,
    reasoning: 15,
    production: 10,
    tradeoffs: 10,
    communication: 5,
  };
  const cases = [
    {
      label: 'missing runtime dimension',
      dimensions: {
        technicalCorrectness: 45,
        completeness: 20,
        reasoning: 15,
        production: 10,
        tradeoffs: 10,
      },
      code: 'rubric.dimension-schema',
    },
    {
      label: 'unexpected runtime dimension',
      dimensions: { ...validDimensions, clarity: 0 },
      code: 'rubric.dimension-schema',
    },
    {
      label: 'nonnumeric weight',
      dimensions: { ...validDimensions, technicalCorrectness: '"40"' },
      code: 'rubric.dimensions',
    },
    {
      label: 'negative weight',
      dimensions: { ...validDimensions, technicalCorrectness: -1, completeness: 61 },
      code: 'rubric.dimensions',
    },
    {
      label: 'total different from 100',
      dimensions: { ...validDimensions, communication: 4 },
      code: 'rubric.total',
    },
  ];

  for (const [index, scenario] of cases.entries()) {
    const project = await createProject(t, {
      [`java/basic/java-basics-${index}.md`]: lesson(),
      [`java/interview/interview-java-basics-${index}.md`]: interview({
        dimensions: scenario.dimensions,
      }),
    });
    const result = await compileKnowledge({ projectRoot: project });
    assert.ok(
      result.diagnostics.errors.some((item) => item.code === scenario.code),
      `expected ${scenario.code} for ${scenario.label}`,
    );
  }
});

test('reports invalid level and contentType', async (t) => {
  const project = await createProject(t, {
    'java/basic/invalid.md': lesson({ level: 'senior', contentType: 'magic' }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.ok(result.diagnostics.errors.some((item) => item.code === 'lesson.level'));
  assert.ok(result.diagnostics.errors.some((item) => item.code === 'lesson.content-type'));
});

test('reports a missing source and an unregistered official source domain', async (t) => {
  const missingProject = await createProject(t, {
    'java/basic/no-source.md': lesson({ sources: '[]' }),
  });
  const missing = await compileKnowledge({ projectRoot: missingProject });
  assert.ok(missing.diagnostics.errors.some((item) => item.code === 'source.required'));

  const domainProject = await createProject(t, {
    'java/basic/domain.md': lesson({ sourceUrl: 'https://unknown.invalid/docs' }),
  });
  const domain = await compileKnowledge({ projectRoot: domainProject });
  assert.ok(domain.diagnostics.errors.some((item) => item.code === 'source.domain'));
});

test('reports broken related and prerequisite references', async (t) => {
  const project = await createProject(t, {
    'java/basic/relations.md': lesson({
      prerequisites: '[missing-prerequisite]',
      related: '[missing-related]',
    }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  const missing = result.diagnostics.errors.filter((item) => item.code === 'relation.missing');
  assert.equal(missing.length, 2);
});

test('detects prerequisite cycles', async (t) => {
  const project = await createProject(t, {
    'java/basic/a.md': lesson({ id: 'lesson-a', slug: 'lesson-a', prerequisites: '[lesson-b]' }),
    'java/basic/b.md': lesson({ id: 'lesson-b', slug: 'lesson-b', prerequisites: '[lesson-a]' }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.ok(result.diagnostics.errors.some((item) => item.code === 'prerequisite.cycle'));
});

test('derives previous and next navigation from metadata order', async (t) => {
  const project = await createProject(t, {
    'java/basic/one.md': lesson({ id: 'lesson-one', slug: 'lesson-one', order: 10 }),
    'java/basic/two.md': lesson({ id: 'lesson-two', slug: 'lesson-two', order: 20 }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.deepEqual(result.diagnostics.errors, []);
  const one = result.artifacts['lessons.json'].find((item) => item.id === 'lesson-one');
  const two = result.artifacts['lessons.json'].find((item) => item.id === 'lesson-two');
  assert.equal(one.previous, '');
  assert.equal(one.next, 'lesson-two');
  assert.equal(two.previous, 'lesson-one');
  assert.equal(two.next, '');
});

test('keeps roadmap navigation reciprocal when roadmaps overlap', async (t) => {
  const project = await createProject(t, {
    'java/basic/one.md': lesson({ id: 'lesson-one', slug: 'lesson-one', order: 10 }),
    'java/basic/two.md': lesson({ id: 'lesson-two', slug: 'lesson-two', order: 20 }),
    'java/basic/three.md': lesson({ id: 'lesson-three', slug: 'lesson-three', order: 30 }),
    'java/basic/four.md': lesson({ id: 'lesson-four', slug: 'lesson-four', order: 40 }),
    '_roadmaps/primary.md': roadmapWithSteps('primary-roadmap', [
      'lesson-one',
      'lesson-two',
      'lesson-three',
    ]),
    '_roadmaps/secondary.md': roadmapWithSteps('secondary-roadmap', [
      'lesson-three',
      'lesson-four',
    ]),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.deepEqual(result.diagnostics.errors, []);
  const lessons = new Map(result.artifacts['lessons.json'].map((item) => [item.id, item]));

  assert.equal(lessons.get('lesson-three').previous, 'lesson-two');
  assert.equal(lessons.get('lesson-two').next, 'lesson-three');
  assert.equal(lessons.get('lesson-three').next, '');
  assert.equal(lessons.get('lesson-four').previous, '');
  assert.equal(lessons.get('lesson-four').next, '');
});

test('extracts embedded interview blocks with a deterministic rubric', async (t) => {
  const embedded = `
:::interview
id: interview-embedded-java
difficulty: middle
question: Java là gì?
answer30s: JVM language.
answerDetailed: Java chạy trên JVM.
production: Pin runtime version.
tradeoffs: Portability có chi phí runtime.
wrongAnswer: Java chỉ là compiler.
followUps: [JVM là gì?]
mustInclude: [JVM]
strongAnswerIncludes: [bytecode]
:::
`;
  const project = await createProject(t, {
    'java/basic/java-basics.md': lesson({ extraBody: embedded }),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.deepEqual(result.diagnostics.errors, []);
  const question = result.artifacts['interview.json'][0];
  assert.equal(question.id, 'interview-embedded-java');
  assert.equal(question.rubric.concepts[0].required, true);
  assert.deepEqual(question.relatedLessons, ['java-basics']);
});

test('extracts manual and derived flashcards and gives manual cards precedence', async (t) => {
  const project = await createProject(t, {
    'java/basic/java-basics.md': lesson({
      extraBody: `
:::flashcard
id: java-question-manual
front: Java là gì?
back: Một ngôn ngữ và platform chạy trên JVM.
level: basic
tags: [java]
:::
`,
    }),
    'java/interview/interview-java-basics.md': interview(),
  });
  const result = await compileKnowledge({ projectRoot: project });
  assert.deepEqual(result.diagnostics.errors, []);
  const matching = result.artifacts['flashcards.json'].filter((card) => card.front === 'Java là gì?');
  assert.equal(matching.length, 1);
  assert.equal(matching[0].generated, false);
  assert.ok(result.artifacts['flashcards.json'].some((card) => card.generated));
});

test('emits all seven valid artifacts deterministically', async (t) => {
  const project = await createProject(t, {
    'java/basic/java-basics.md': lesson(),
    'java/interview/interview-java-basics.md': interview(),
    '_roadmaps/java.md': roadmap(),
  });
  const first = await compileKnowledge({ projectRoot: project });
  await writeGeneratedArtifacts(first);
  const firstSnapshot = stableStringify(first.artifacts);
  const second = await compileKnowledge({ projectRoot: project });
  assert.equal(stableStringify(second.artifacts), firstSnapshot);
  const generated = await fs.readdir(path.join(project, 'public', 'generated'));
  assert.deepEqual(generated.sort(), [
    'content-stats.json',
    'flashcards.json',
    'interview.json',
    'lessons.json',
    'manifest.json',
    'roadmaps.json',
    'search-index.json',
  ]);
  for (const file of generated) {
    JSON.parse(await fs.readFile(path.join(project, 'public', 'generated', file), 'utf8'));
  }
});

test('uses front matter identity so replacing or renaming Markdown changes output without code changes', async (t) => {
  const source = lesson();
  const project = await createProject(t, { 'java/basic/original-filename.md': source });
  const first = await compileKnowledge({ projectRoot: project });
  const original = first.artifacts['lessons.json'][0];
  const oldFile = path.join(project, 'knowledge', 'java', 'basic', 'original-filename.md');
  const newFile = path.join(project, 'knowledge', 'java', 'basic', 'replacement-filename.md');
  await fs.rename(oldFile, newFile);
  await fs.writeFile(
    newFile,
    source.replace('Nội dung tổng quan.', 'Nội dung Markdown đã được thay thế.'),
    'utf8',
  );
  const second = await compileKnowledge({ projectRoot: project });
  const replacement = second.artifacts['lessons.json'][0];
  assert.equal(replacement.id, original.id);
  assert.equal(replacement.slug, original.slug);
  assert.equal(replacement.path, original.path);
  assert.notEqual(replacement.searchText, original.searchText);
  assert.match(replacement.searchText, /Markdown đã được thay thế/);
});

async function createProject(t, documents) {
  const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'knowledge-pipeline-'));
  t.after(() => fs.rm(projectRoot, { recursive: true, force: true }));
  const registryPath = path.join(projectRoot, 'knowledge', '_config', 'official-sources.json');
  await fs.mkdir(path.dirname(registryPath), { recursive: true });
  await fs.writeFile(
    registryPath,
    JSON.stringify([{ technology: 'Test', organization: 'Test', domains: ['docs.example.com'] }]),
  );
  for (const [relativeFile, source] of Object.entries(documents)) {
    const target = path.join(projectRoot, 'knowledge', relativeFile);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, source, 'utf8');
  }
  return projectRoot;
}

function lesson(overrides = {}) {
  const metadata = {
    id: 'java-basics',
    slug: 'java-basics',
    title: 'Java Basics',
    description: 'Nền tảng Java.',
    technology: 'Java',
    domain: 'backend',
    category: 'java',
    level: 'basic',
    contentType: 'core',
    order: 10,
    estimatedMinutes: 20,
    tags: '[java]',
    prerequisites: '[]',
    related: '[]',
    learningObjectives: '[Hiểu Java]',
    sources: undefined,
    lastReviewed: '2026-09-26',
    sourceUrl: 'https://docs.example.com/java',
    extraBody: '',
    ...overrides,
  };
  const sources =
    metadata.sources ??
    `
  - title: Java documentation
    organization: Example
    url: ${metadata.sourceUrl}
    type: official-documentation`;
  return `---
id: ${metadata.id}
slug: ${metadata.slug}
title: ${metadata.title}
description: ${metadata.description}
technology: ${metadata.technology}
domain: ${metadata.domain}
category: ${metadata.category}
level: ${metadata.level}
contentType: ${metadata.contentType}
order: ${metadata.order}
estimatedMinutes: ${metadata.estimatedMinutes}
tags: ${metadata.tags}
prerequisites: ${metadata.prerequisites}
related: ${metadata.related}
learningObjectives: ${metadata.learningObjectives}
sources: ${sources}
lastReviewed: ${metadata.lastReviewed}
---

# ${metadata.title}

## Tổng quan

Nội dung tổng quan.

${metadata.extraBody}

## Key Takeaways

- Java chạy trên JVM.

## Nguồn chính thống

- [Java documentation](${metadata.sourceUrl})
`;
}

function interview(overrides = {}) {
  const dimensions = overrides.dimensions ?? {
    technicalCorrectness: 40,
    completeness: 20,
    reasoning: 15,
    production: 10,
    tradeoffs: 10,
    communication: 5,
  };
  const dimensionLines = Object.entries(dimensions)
    .map(([key, value]) => `    ${key}: ${value}`)
    .join('\n');
  return `---
id: interview-java-basics
type: interview-question
technology: Java
category: Java
difficulty: junior
topics: [java, jvm]
relatedLessons: [java-basics]
sources:
  - title: Java documentation
    organization: Example
    url: https://docs.example.com/java
    type: official-documentation
rubric:
  dimensions:
${dimensionLines}
  concepts:
    - id: jvm
      required: true
      aliases: [JVM, Java Virtual Machine]
      points:
        technicalCorrectness: 40
        completeness: 20
  misconceptions:
    - id: compiler-only
      patterns: [Java chỉ là compiler]
      penalty: 20
---

# Java là gì?

## Rubric

### Must Include

- JVM

### Strong Answer Includes

- bytecode

## Câu trả lời 30 giây

Java là ngôn ngữ và platform JVM.

## Câu trả lời chi tiết

Java chạy trên JVM.

## Góc nhìn Production

Pin runtime version.

## Trade-offs

Portability có chi phí runtime.

## Câu trả lời sai thường gặp

Java chỉ là compiler.

## Follow-up

- JVM là gì?

## Nguồn chính thống

- [Java documentation](https://docs.example.com/java)
`;
}

function embeddedInterview(id) {
  return `
:::interview
id: ${id}
difficulty: middle
question: Embedded interview ${id}?
answer30s: JVM language.
answerDetailed: Java chạy trên JVM.
production: Pin runtime version.
tradeoffs: Portability có chi phí runtime.
wrongAnswer: Java chỉ là compiler.
followUps: [JVM là gì?]
mustInclude: [JVM]
strongAnswerIncludes: [bytecode]
:::
`;
}

function roadmap() {
  return `---
id: java-roadmap
type: roadmap
title: Java Roadmap
description: Lộ trình Java.
steps:
  - lessonId: java-basics
    note: Bắt đầu từ nền tảng.
---

# Java Roadmap

## Tổng quan

Lộ trình học Java.
`;
}

function roadmapWithSteps(id, lessonIds) {
  const steps = lessonIds
    .map((lessonId) => `  - lessonId: ${lessonId}\n    note: Học ${lessonId}.`)
    .join('\n');
  return `---
id: ${id}
type: roadmap
title: ${id}
description: Lộ trình kiểm thử.
steps:
${steps}
---

# ${id}

## Tổng quan

Lộ trình kiểm thử navigation.
`;
}
