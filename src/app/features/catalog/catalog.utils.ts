import { Lesson, LearningLevel, RoadmapDefinition } from '../../core/models/content.models';
import {
  CatalogFilterOption,
  CatalogLessonGroup,
  CatalogLevel,
  CatalogSort,
  TechnologyFacet,
} from './catalog.models';

export const LEVELS: readonly LearningLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
  'senior',
];

export const LEVEL_LABELS: Readonly<Record<LearningLevel, string>> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  senior: 'Senior',
};

export const SORT_OPTIONS: readonly { value: CatalogSort; label: string }[] = [
  { value: 'route', label: 'Lộ trình' },
  { value: 'title', label: 'Tên A–Z' },
  { value: 'duration-asc', label: 'Thời lượng ngắn → dài' },
  { value: 'duration-desc', label: 'Thời lượng dài → ngắn' },
];

interface TechnologySeed {
  key: string;
  label: string;
  matchText: string;
  lessonIds: Set<string>;
  firstLessonIndex: number;
  firstSeedIndex: number;
  compoundPosition: number;
}

interface FacetCandidate {
  key: string;
  label: string;
  matchTexts: string[];
  lessonIds: Set<string>;
  firstLessonIndex: number;
  firstSeedIndex: number;
  compoundPosition: number;
}

interface RoadmapRank {
  roadmap: RoadmapDefinition;
  originalIndex: number;
  overlap: number;
  score: number;
}

const LEVEL_RANK = new Map<LearningLevel, number>(LEVELS.map((level, index) => [level, index]));

export function normalizeCatalogLevel(value: string | undefined): CatalogLevel {
  return value === 'all' || LEVELS.some((level) => level === value)
    ? (value as CatalogLevel)
    : 'all';
}

export function normalizeCatalogSort(value: string | undefined): CatalogSort {
  return SORT_OPTIONS.some((option) => option.value === value) ? (value as CatalogSort) : 'route';
}

export function normalizeTechnologySelection(
  value: string | undefined,
  facets: readonly TechnologyFacet[],
): string {
  if (!value || value === 'all') return 'all';
  return facets.some((facet) => facet.key === value) ? value : 'all';
}

export function splitTechnology(value: string): string[] {
  return value
    .split(/\s+\/\s+|,\s*|\s+(?:and|và)\s+/giu)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function normalizeFacetKey(value: string): string {
  return normalizeText(value).replace(/\s+/g, '-');
}

export function deriveTechnologyFacets(lessons: readonly Lesson[]): TechnologyFacet[] {
  if (lessons.length < 2) return [];

  const seeds = deriveTechnologySeeds(lessons);
  const observedCompounds = lessons.map((lesson) => splitTechnology(lesson.technology));
  let candidates = mergeObservedCohesiveSeeds(seeds, observedCompounds);
  candidates = removeCategoryEchoes(candidates, lessons[0]?.category ?? '');
  candidates = removeContainedChildren(candidates);
  candidates = deduplicateMembership(candidates);

  const minimumSupport = Math.max(2, Math.ceil(lessons.length * 0.1));
  const maximumVisible = Math.min(6, Math.max(2, Math.ceil(Math.sqrt(lessons.length))));

  const prerequisiteDepth = buildPrerequisiteDepth(lessons);
  const supported = candidates
    .filter((candidate) => candidate.lessonIds.size >= minimumSupport)
    .sort(compareCandidateQuality)
    .slice(0, maximumVisible)
    .sort((left, right) => compareCandidateDisplayOrder(left, right, lessons, prerequisiteDepth));

  if (supported.length < 2) return [];

  return supported.map((candidate) => ({
    key: candidate.key,
    label: candidate.label,
    matchTexts: candidate.matchTexts,
    lessonIds: candidate.lessonIds,
    specificity: candidate.matchTexts.length * 1000 - candidate.lessonIds.size,
  }));
}

export function orderLessonsByCurriculum(
  lessons: readonly Lesson[],
  roadmaps: readonly RoadmapDefinition[],
): Lesson[] {
  if (lessons.length < 2) return [...lessons];

  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const inputIndex = new Map(lessons.map((lesson, index) => [lesson.id, index]));
  const rankedRoadmaps = rankRoadmaps(lessons, roadmaps);
  const roadmapPosition = new Map<string, [number, number]>();
  const orderingFacets = deriveTechnologyFacets(lessons);
  const facetIndex = new Map(orderingFacets.map((facet, index) => [facet.key, index + 1]));
  const lessonTrack = new Map(
    lessons.map((lesson) => {
      const target = [...orderingFacets]
        .filter((facet) => facet.lessonIds.has(lesson.id))
        .sort(
          (left, right) =>
            right.specificity - left.specificity ||
            (facetIndex.get(left.key) ?? 0) - (facetIndex.get(right.key) ?? 0),
        )[0];
      return [lesson.id, target ? (facetIndex.get(target.key) ?? 0) : 0];
    }),
  );

  rankedRoadmaps.forEach(({ roadmap }, roadmapIndex) => {
    roadmap.steps.forEach((step, stepIndex) => {
      if (lessonById.has(step.lessonId) && !roadmapPosition.has(step.lessonId)) {
        roadmapPosition.set(step.lessonId, [roadmapIndex, stepIndex]);
      }
    });
  });

  const outgoing = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  lessons.forEach((lesson) => {
    outgoing.set(lesson.id, []);
    indegree.set(lesson.id, 0);
  });

  lessons.forEach((lesson) => {
    lesson.prerequisites.forEach((prerequisiteId) => {
      if (!lessonById.has(prerequisiteId)) return;
      outgoing.get(prerequisiteId)?.push(lesson.id);
      indegree.set(lesson.id, (indegree.get(lesson.id) ?? 0) + 1);
    });
  });

  const compareIds = (leftId: string, rightId: string): number => {
    const left = lessonById.get(leftId);
    const right = lessonById.get(rightId);
    if (!left || !right) return 0;

    const leftPosition = roadmapPosition.get(leftId) ?? [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    const rightPosition = roadmapPosition.get(rightId) ?? [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    return (
      (lessonTrack.get(leftId) ?? 0) - (lessonTrack.get(rightId) ?? 0) ||
      (LEVEL_RANK.get(left.level) ?? 0) - (LEVEL_RANK.get(right.level) ?? 0) ||
      leftPosition[0] - rightPosition[0] ||
      leftPosition[1] - rightPosition[1] ||
      (inputIndex.get(leftId) ?? 0) - (inputIndex.get(rightId) ?? 0) ||
      left.title.localeCompare(right.title, 'vi')
    );
  };

  const ready = lessons.filter((lesson) => indegree.get(lesson.id) === 0).map((lesson) => lesson.id);
  const orderedIds: string[] = [];

  while (ready.length) {
    ready.sort(compareIds);
    const currentId = ready.shift();
    if (!currentId) break;
    orderedIds.push(currentId);
    (outgoing.get(currentId) ?? []).forEach((dependentId) => {
      const remaining = (indegree.get(dependentId) ?? 1) - 1;
      indegree.set(dependentId, remaining);
      if (remaining === 0) ready.push(dependentId);
    });
  }

  if (orderedIds.length < lessons.length) {
    const seen = new Set(orderedIds);
    orderedIds.push(...lessons.map((lesson) => lesson.id).filter((id) => !seen.has(id)).sort(compareIds));
  }

  return orderedIds.flatMap((id) => {
    const lesson = lessonById.get(id);
    return lesson ? [lesson] : [];
  });
}

export function applyCatalogFilters(
  lessons: readonly Lesson[],
  level: CatalogLevel,
  technology: string,
  facets: readonly TechnologyFacet[],
): Lesson[] {
  const facet = facets.find((item) => item.key === technology);
  return lessons.filter(
    (lesson) =>
      (level === 'all' || lesson.level === level) &&
      (!facet || facet.lessonIds.has(lesson.id)),
  );
}

export function sortCatalogLessons(
  lessons: readonly Lesson[],
  sort: CatalogSort,
  curriculumIndex: ReadonlyMap<string, number>,
): Lesson[] {
  const sorted = [...lessons];
  sorted.sort((left, right) => {
    if (sort === 'title') return left.title.localeCompare(right.title, 'vi');
    if (sort === 'duration-asc') {
      return left.estimatedMinutes - right.estimatedMinutes || left.title.localeCompare(right.title, 'vi');
    }
    if (sort === 'duration-desc') {
      return right.estimatedMinutes - left.estimatedMinutes || left.title.localeCompare(right.title, 'vi');
    }
    return (
      (curriculumIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
      (curriculumIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    );
  });
  return sorted;
}

export function buildLevelOptions(
  lessons: readonly Lesson[],
  selectedTechnology: string,
  facets: readonly TechnologyFacet[],
): CatalogFilterOption[] {
  const facet = facets.find((item) => item.key === selectedTechnology);
  const relevantLessons = facet
    ? lessons.filter((lesson) => facet.lessonIds.has(lesson.id))
    : [...lessons];

  return [
    { value: 'all', label: 'Tất cả', count: relevantLessons.length },
    ...LEVELS.map((level) => ({
      value: level,
      label: LEVEL_LABELS[level],
      count: relevantLessons.filter((lesson) => lesson.level === level).length,
    })),
  ];
}

export function buildTechnologyOptions(
  lessons: readonly Lesson[],
  selectedLevel: CatalogLevel,
  facets: readonly TechnologyFacet[],
): CatalogFilterOption[] {
  const relevantLessons =
    selectedLevel === 'all' ? [...lessons] : lessons.filter((lesson) => lesson.level === selectedLevel);
  return [
    { value: 'all', label: 'Tất cả', count: relevantLessons.length },
    ...facets.map((facet) => ({
      value: facet.key,
      label: facet.label,
      count: relevantLessons.filter((lesson) => facet.lessonIds.has(lesson.id)).length,
    })),
  ];
}

export function groupCatalogLessons(
  lessons: readonly Lesson[],
  curriculumIndex: ReadonlyMap<string, number>,
  facets: readonly TechnologyFacet[],
  selectedTechnology: string,
  sort: CatalogSort = 'route',
): CatalogLessonGroup[] {
  const items = lessons.map((lesson) => ({
    lesson,
    curriculumIndex: curriculumIndex.get(lesson.id) ?? 0,
  }));
  if (!items.length) return [];

  if (selectedTechnology !== 'all' || sort !== 'route') {
    const selectedFacet = facets.find((facet) => facet.key === selectedTechnology);
    return renumberGroups([
      {
        key: selectedFacet?.key ?? 'sorted-lessons',
        label: selectedFacet?.label ?? 'Kết quả đã sắp xếp',
        items,
      },
    ]);
  }

  if (!facets.length) {
    return renumberGroups([{ key: 'curriculum', label: 'Lộ trình đề xuất', items }]);
  }

  const groups: CatalogLessonGroup[] = [];
  items.forEach((item, itemIndex) => {
    const matchingFacets = facets
      .filter((facet) => facet.lessonIds.has(item.lesson.id))
      .sort(
        (left, right) =>
          right.specificity - left.specificity || facets.indexOf(left) - facets.indexOf(right),
      );
    const target = matchingFacets[0];
    const baseKey = target?.key ?? 'related-foundations';
    const label = target?.label ?? 'Nền tảng liên quan';
    const previous = groups.at(-1);
    if (previous?.key.startsWith(baseKey + '--')) previous.items.push(item);
    else groups.push({ key: baseKey + '--' + itemIndex, label, items: [item] });
  });
  return renumberGroups(groups);
}

export function totalDuration(lessons: readonly Lesson[]): number {
  return lessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return minutes + ' phút';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? hours + ' giờ ' + remainingMinutes + ' phút' : hours + ' giờ';
}

function deriveTechnologySeeds(lessons: readonly Lesson[]): TechnologySeed[] {
  const observedLabels = new Map<
    string,
    {
      labels: Map<string, number>;
      firstLessonIndex: number;
      firstSeedIndex: number;
      compoundPosition: number;
    }
  >();
  let seedIndex = 0;

  lessons.forEach((lesson, lessonIndex) => {
    splitTechnology(lesson.technology).forEach((label, compoundPosition) => {
      const matchText = normalizeText(label);
      if (!matchText) return;
      const existing = observedLabels.get(matchText);
      if (existing) {
        existing.labels.set(label, (existing.labels.get(label) ?? 0) + 1);
        existing.compoundPosition = Math.min(existing.compoundPosition, compoundPosition);
      }
      else {
        observedLabels.set(matchText, {
          labels: new Map([[label, 1]]),
          firstLessonIndex: lessonIndex,
          firstSeedIndex: seedIndex,
          compoundPosition,
        });
      }
      seedIndex += 1;
    });
  });

  return [...observedLabels.entries()].map(([matchText, observation]) => {
    const label = [...observation.labels.entries()].sort(
      (left, right) => right[1] - left[1] || left[0].length - right[0].length,
    )[0]?.[0] ?? matchText;
    const lessonIds = new Set(
      lessons.filter((lesson) => lessonMatchesText(lesson, matchText)).map((lesson) => lesson.id),
    );
    return {
      key: normalizeFacetKey(label),
      label,
      matchText,
      lessonIds,
      firstLessonIndex: observation.firstLessonIndex,
      firstSeedIndex: observation.firstSeedIndex,
      compoundPosition: observation.compoundPosition,
    };
  });
}

function mergeObservedCohesiveSeeds(
  seeds: readonly TechnologySeed[],
  observedCompounds: readonly string[][],
): FacetCandidate[] {
  const parent = seeds.map((_, index) => index);
  const find = (index: number): number => {
    let root = index;
    while (parent[root] !== root) root = parent[root] ?? root;
    while (parent[index] !== index) {
      const next = parent[index] ?? index;
      parent[index] = root;
      index = next;
    }
    return root;
  };
  const unite = (left: number, right: number): void => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
  };

  for (let left = 0; left < seeds.length; left += 1) {
    for (let right = left + 1; right < seeds.length; right += 1) {
      const leftSeed = seeds[left];
      const rightSeed = seeds[right];
      if (!leftSeed || !rightSeed) continue;
      const observedTogether = observedCompounds.some((parts) => {
        const keys = parts.map(normalizeText);
        return keys.includes(leftSeed.matchText) && keys.includes(rightSeed.matchText);
      });
      if (!observedTogether) continue;
      const intersection = [...leftSeed.lessonIds].filter((id) => rightSeed.lessonIds.has(id)).length;
      const union = new Set([...leftSeed.lessonIds, ...rightSeed.lessonIds]).size;
      if (union > 0 && intersection / union >= 0.75) unite(left, right);
    }
  }

  const clusters = new Map<number, TechnologySeed[]>();
  seeds.forEach((seed, index) => {
    const root = find(index);
    clusters.set(root, [...(clusters.get(root) ?? []), seed]);
  });

  return [...clusters.values()].map((cluster) => {
    const ordered = [...cluster].sort(
      (left, right) =>
        right.lessonIds.size - left.lessonIds.size ||
        left.compoundPosition - right.compoundPosition ||
        left.key.localeCompare(right.key, 'vi'),
    );
    const lessonIds = new Set(ordered.flatMap((seed) => [...seed.lessonIds]));
    const label = ordered.map((seed) => seed.label).join(' / ');
    return {
      key: ordered[0]?.key ?? normalizeFacetKey(label),
      label,
      matchTexts: ordered.map((seed) => seed.matchText),
      lessonIds,
      firstLessonIndex: Math.min(...ordered.map((seed) => seed.firstLessonIndex)),
      firstSeedIndex: Math.min(...ordered.map((seed) => seed.firstSeedIndex)),
      compoundPosition: Math.min(...ordered.map((seed) => seed.compoundPosition)),
    };
  });
}

function removeCategoryEchoes(
  candidates: readonly FacetCandidate[],
  category: string,
): FacetCandidate[] {
  const categoryWords = stemmedWords(normalizeText(category));
  if (!categoryWords.length) return [...candidates];
  return candidates.filter((candidate) => {
    const candidateWords = stemmedWords(candidate.matchTexts.join(' '));
    return !categoryWords.every((word) => candidateWords.includes(word));
  });
}

function removeContainedChildren(candidates: readonly FacetCandidate[]): FacetCandidate[] {
  return candidates.filter((candidate) => {
    return !candidates.some((possibleParent) => {
      if (possibleParent === candidate || possibleParent.lessonIds.size < candidate.lessonIds.size) {
        return false;
      }
      const isTextParent = candidate.matchTexts.some((childText) =>
        possibleParent.matchTexts.some(
          (parentText) =>
            parentText !== childText &&
            (' ' + childText + ' ').includes(' ' + parentText + ' '),
        ),
      );
      return isTextParent && isSubset(candidate.lessonIds, possibleParent.lessonIds);
    });
  });
}

function deduplicateMembership(candidates: readonly FacetCandidate[]): FacetCandidate[] {
  const byMembership = new Map<string, FacetCandidate>();
  candidates.forEach((candidate) => {
    const signature = [...candidate.lessonIds].sort().join('|');
    const existing = byMembership.get(signature);
    if (!existing || candidate.label.length < existing.label.length) byMembership.set(signature, candidate);
  });
  return [...byMembership.values()];
}

function rankRoadmaps(
  lessons: readonly Lesson[],
  roadmaps: readonly RoadmapDefinition[],
): RoadmapRank[] {
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  return roadmaps
    .map((roadmap, originalIndex) => {
      const overlap = roadmap.steps.filter((step) => lessonIds.has(step.lessonId)).length;
      const precision = roadmap.steps.length ? overlap / roadmap.steps.length : 0;
      const recall = lessons.length ? overlap / lessons.length : 0;
      const score = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
      return { roadmap, originalIndex, overlap, score };
    })
    .filter((rank) => rank.overlap > 0)
    .sort((left, right) => {
      return (
        right.score - left.score ||
        right.overlap - left.overlap ||
        left.originalIndex - right.originalIndex
      );
    });
}

function lessonMatchesText(lesson: Lesson, matchText: string): boolean {
  const metadataParts = [lesson.technology, ...lesson.tags].flatMap((value) => {
    if (value === lesson.technology) return splitTechnology(value).map(normalizeText);
    return [normalizeText(value)];
  });
  return metadataParts.some(
    (part) => part === matchText || part.startsWith(matchText + ' '),
  );
}

function compareCandidateQuality(left: FacetCandidate, right: FacetCandidate): number {
  return (
    right.lessonIds.size - left.lessonIds.size ||
    left.matchTexts.length - right.matchTexts.length ||
    left.label.localeCompare(right.label, 'vi')
  );
}

function compareCandidateDisplayOrder(
  left: FacetCandidate,
  right: FacetCandidate,
  lessons: readonly Lesson[],
  prerequisiteDepth: ReadonlyMap<string, number>,
): number {
  return (
    candidateLearningStage(left, lessons, prerequisiteDepth) -
      candidateLearningStage(right, lessons, prerequisiteDepth) ||
    left.compoundPosition - right.compoundPosition ||
    right.lessonIds.size - left.lessonIds.size ||
    left.label.localeCompare(right.label, 'vi')
  );
}

function candidateLearningStage(
  candidate: FacetCandidate,
  lessons: readonly Lesson[],
  prerequisiteDepth: ReadonlyMap<string, number>,
): number {
  const stages = lessons
    .filter((lesson) => candidate.lessonIds.has(lesson.id))
    .map(
      (lesson) =>
        (prerequisiteDepth.get(lesson.id) ?? 0) * 10 + (LEVEL_RANK.get(lesson.level) ?? 0),
    );
  return stages.length ? Math.min(...stages) : Number.MAX_SAFE_INTEGER;
}

function buildPrerequisiteDepth(lessons: readonly Lesson[]): ReadonlyMap<string, number> {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const depth = new Map<string, number>();
  const visiting = new Set<string>();

  const visit = (id: string): number => {
    const known = depth.get(id);
    if (known !== undefined) return known;
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const lesson = lessonById.get(id);
    const prerequisiteDepths = (lesson?.prerequisites ?? [])
      .filter((prerequisiteId) => lessonById.has(prerequisiteId))
      .map((prerequisiteId) => visit(prerequisiteId) + 1);
    visiting.delete(id);
    const value = prerequisiteDepths.length ? Math.max(...prerequisiteDepths) : 0;
    depth.set(id, value);
    return value;
  };

  lessons.forEach((lesson) => visit(lesson.id));
  return depth;
}

function renumberGroups(groups: readonly CatalogLessonGroup[]): CatalogLessonGroup[] {
  let index = 1;
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, curriculumIndex: index++ })),
  }));
}

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .trim();
}

function stemmedWords(value: string): string[] {
  return value.split(' ').filter(Boolean).map((word) => (word.length > 4 && word.endsWith('s') ? word.slice(0, -1) : word));
}

function isSubset(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  return [...left].every((value) => right.has(value));
}
