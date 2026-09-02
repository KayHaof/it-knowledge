import { Lesson, RoadmapDefinition } from '../../core/models/content.models';
import {
  applyCatalogFilters,
  buildLevelOptions,
  buildTechnologyOptions,
  deriveTechnologyFacets,
  formatDuration,
  groupCatalogLessons,
  normalizeCatalogLevel,
  normalizeTechnologySelection,
  orderLessonsByCurriculum,
  splitTechnology,
  totalDuration,
} from './catalog.utils';

describe('catalog utilities', () => {
  it('derives compact metadata-backed technology facets without splitting CI/CD', () => {
    const lessons = backendLessons();
    const facets = deriveTechnologyFacets(lessons);

    expect(splitTechnology('CI/CD and GitOps / Kubernetes')).toEqual([
      'CI/CD',
      'GitOps',
      'Kubernetes',
    ]);
    expect(facets.map((facet) => [facet.key, facet.label, facet.lessonIds.size])).toEqual([
      ['java', 'Java', 5],
      ['jvm', 'JVM', 2],
      ['spring', 'Spring', 4],
      ['jpa', 'JPA / Hibernate', 2],
    ]);
  });

  it('composes technology and level filters and derives cross-filter counts', () => {
    const lessons = backendLessons();
    const facets = deriveTechnologyFacets(lessons);
    const filtered = applyCatalogFilters(lessons, 'advanced', 'jpa', facets);

    expect(filtered.map((lesson) => lesson.id)).toEqual(['jpa-context']);
    expect(totalDuration(filtered)).toBe(55);

    const levelOptions = buildLevelOptions(lessons, 'jpa', facets);
    expect(levelOptions.map((option) => [option.value, option.count])).toEqual([
      ['all', 2],
      ['beginner', 0],
      ['intermediate', 0],
      ['advanced', 1],
      ['senior', 1],
    ]);

    const technologyOptions = buildTechnologyOptions(lessons, 'advanced', facets);
    expect(technologyOptions.find((option) => option.value === 'jpa')?.count).toBe(1);
    expect(technologyOptions.find((option) => option.value === 'spring')?.count).toBe(1);
  });

  it('falls back to all for invalid query values', () => {
    const facets = deriveTechnologyFacets(backendLessons());

    expect(normalizeCatalogLevel('expert')).toBe('all');
    expect(normalizeCatalogLevel(undefined)).toBe('all');
    expect(normalizeTechnologySelection('unknown', facets)).toBe('all');
    expect(normalizeTechnologySelection('jpa', facets)).toBe('jpa');
  });

  it('keeps prerequisite order even when a roadmap places the dependent first', () => {
    const prerequisite = createLesson({
      id: 'foundation',
      title: 'Foundation',
      level: 'beginner',
      technology: 'Java',
    });
    const dependent = createLesson({
      id: 'advanced',
      title: 'Advanced',
      level: 'advanced',
      technology: 'Java',
      prerequisites: ['foundation'],
    });
    const roadmap: RoadmapDefinition = {
      id: 'backend',
      title: 'Backend',
      description: '',
      steps: [
        { lessonId: 'advanced', note: '' },
        { lessonId: 'foundation', note: '' },
      ],
    };

    expect(orderLessonsByCurriculum([dependent, prerequisite], [roadmap]).map((item) => item.id)).toEqual([
      'foundation',
      'advanced',
    ]);
  });

  it('removes empty groups and uses the selected technology as one focused group', () => {
    const lessons = backendLessons();
    const facets = deriveTechnologyFacets(lessons);
    const index = new Map(lessons.map((lesson, position) => [lesson.id, position + 1]));
    const advancedJpa = applyCatalogFilters(lessons, 'advanced', 'jpa', facets);
    const groups = groupCatalogLessons(advancedJpa, index, facets, 'jpa');

    expect(groups).toHaveLength(1);
    expect(groups[0]?.label).toBe('JPA / Hibernate');
    expect(groups[0]?.items.map((item) => item.lesson.id)).toEqual(['jpa-context']);
  });

  it('formats visible duration summaries', () => {
    expect(formatDuration(38)).toBe('38 phút');
    expect(formatDuration(60)).toBe('1 giờ');
    expect(formatDuration(125)).toBe('2 giờ 5 phút');
  });
});

function backendLessons(): Lesson[] {
  return [
    createLesson({ id: 'java-object', title: 'Java Object', level: 'beginner', technology: 'Java', tags: ['java'] }),
    createLesson({ id: 'java-collections', title: 'Java Collections', level: 'intermediate', technology: 'Java', tags: ['java'] }),
    createLesson({ id: 'jvm-memory', title: 'JVM Memory', level: 'intermediate', technology: 'Java / JVM', tags: ['java', 'jvm'] }),
    createLesson({ id: 'jvm-profile', title: 'JVM Profile', level: 'senior', technology: 'Java / JVM', tags: ['java', 'jvm'] }),
    createLesson({ id: 'spring-core', title: 'Spring Core', level: 'intermediate', technology: 'Spring', tags: ['spring'], prerequisites: ['java-object'] }),
    createLesson({ id: 'spring-boot', title: 'Spring Boot', level: 'advanced', technology: 'Spring Boot', tags: ['spring-boot'], prerequisites: ['spring-core'] }),
    createLesson({ id: 'jpa-context', title: 'JPA Context', level: 'advanced', technology: 'JPA / Hibernate', tags: ['jpa', 'hibernate'], prerequisites: ['spring-core'] }),
    createLesson({ id: 'jpa-locking', title: 'JPA Locking', level: 'senior', technology: 'Spring Data JPA / Hibernate', tags: ['spring', 'jpa', 'hibernate'], prerequisites: ['jpa-context'] }),
    createLesson({ id: 'java-errors', title: 'Java Errors', level: 'beginner', technology: 'Java', tags: ['java'] }),
    createLesson({ id: 'spring-testing', title: 'Spring Testing', level: 'intermediate', technology: 'Spring Boot', tags: ['spring-boot'], prerequisites: ['spring-core'] }),
  ];
}

function createLesson(
  overrides: Pick<Lesson, 'id' | 'title' | 'level' | 'technology'> & Partial<Lesson>,
): Lesson {
  return {
    id: overrides.id,
    slug: overrides.id,
    title: overrides.title,
    description: overrides.description ?? '',
    category: overrides.category ?? 'backend',
    technology: overrides.technology,
    level: overrides.level,
    estimatedMinutes: overrides.estimatedMinutes ?? 55,
    tags: overrides.tags ?? [],
    prerequisites: overrides.prerequisites ?? [],
    related: overrides.related ?? [],
    next: overrides.next ?? '',
    learningObjectives: overrides.learningObjectives ?? [],
    lastReviewed: overrides.lastReviewed ?? '2026-09-01',
    sources: overrides.sources ?? [],
    path: overrides.path ?? '/learn/backend/' + overrides.id,
    headings: overrides.headings ?? [],
    blocks: overrides.blocks ?? [],
    searchText: overrides.searchText ?? '',
  };
}
