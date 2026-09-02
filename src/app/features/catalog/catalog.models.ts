import { Lesson, LearningLevel } from '../../core/models/content.models';

export type CatalogLevel = LearningLevel | 'all';
export type CatalogSort = 'route' | 'title' | 'duration-asc' | 'duration-desc';

export interface CatalogFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface TechnologyFacet {
  key: string;
  label: string;
  matchTexts: readonly string[];
  lessonIds: ReadonlySet<string>;
  specificity: number;
}

export interface CatalogLessonItem {
  lesson: Lesson;
  curriculumIndex: number;
}

export interface CatalogLessonGroup {
  key: string;
  label: string;
  items: CatalogLessonItem[];
}
