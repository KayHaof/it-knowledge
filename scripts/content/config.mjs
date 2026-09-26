import path from 'node:path';

export const CONTENT_SCHEMA_VERSION = 1;
export const GENERATED_NOTICE = 'GENERATED FILE — DO NOT EDIT DIRECTLY';

export const LEARNING_LEVELS = Object.freeze(['basic', 'advanced', 'extended']);
export const CONTENT_TYPES = Object.freeze([
  'core',
  'internals',
  'production',
  'troubleshooting',
  'performance',
  'security',
  'architecture',
  'system-design',
  'integration',
  'comparison',
  'reference',
  'interview',
  'supplementary',
]);
export const INTERVIEW_DIFFICULTIES = Object.freeze([
  'junior',
  'middle',
  'senior',
  'system-design',
]);
export const SOURCE_TYPES = Object.freeze([
  'official-documentation',
  'specification',
  'standard',
  'vendor-documentation',
  'academic',
  'secondary',
]);
export const STRUCTURED_BLOCK_TYPES = Object.freeze([
  'note',
  'info',
  'warning',
  'danger',
  'tip',
  'best-practice',
  'production',
  'interview',
  'flashcard',
  'quiz',
  'misconception',
  'glossary',
]);

export const REQUIRED_LESSON_FIELDS = Object.freeze([
  'id',
  'slug',
  'title',
  'description',
  'technology',
  'domain',
  'category',
  'level',
  'contentType',
  'order',
  'estimatedMinutes',
  'tags',
  'learningObjectives',
  'sources',
  'lastReviewed',
]);

export const ARTIFACT_FILES = Object.freeze([
  'lessons.json',
  'interview.json',
  'flashcards.json',
  'search-index.json',
  'roadmaps.json',
  'manifest.json',
  'content-stats.json',
]);

export const LEGACY_SOURCE_TYPE_ALIASES = Object.freeze({
  'official-api-reference': 'official-documentation',
  'internet-standard': 'standard',
  'best-current-practice': 'standard',
  'primary-vendor': 'vendor-documentation',
  'primary-vendor-guidance': 'vendor-documentation',
  'primary-vendor-whitepaper': 'vendor-documentation',
  'security-guidance': 'vendor-documentation',
});

export function createContentConfig(overrides = {}) {
  const projectRoot = path.resolve(overrides.projectRoot ?? process.cwd());
  return {
    projectRoot,
    knowledgeRoot: path.resolve(overrides.knowledgeRoot ?? path.join(projectRoot, 'knowledge')),
    outputRoot: path.resolve(overrides.outputRoot ?? path.join(projectRoot, 'public', 'generated')),
    sourceRegistryPath: path.resolve(
      overrides.sourceRegistryPath ??
        path.join(projectRoot, 'knowledge', '_config', 'official-sources.json'),
    ),
  };
}
