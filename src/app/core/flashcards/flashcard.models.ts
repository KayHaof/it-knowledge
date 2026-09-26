export const FLASHCARD_LEVELS = ['basic', 'advanced', 'extended'] as const;

export type FlashcardLevel = (typeof FLASHCARD_LEVELS)[number];
export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';
export type FlashcardStudyMode = 'all' | 'due' | 'new' | 'bookmarked' | 'difficult';

/** Runtime shape emitted by public/generated/flashcards.json. */
export interface Flashcard {
  id: string;
  technology: string;
  category: string;
  level: FlashcardLevel;
  front: string;
  back: string;
  tags: string[];
  generated: boolean;
  sourceLesson: string;
  sourcePath: string;
  sourceLessonId?: string;
  sourceLessonTitle?: string;
}

export interface FlashcardReviewState {
  lastReviewed: string | null;
  reviewCount: number;
  lastRating: FlashcardRating | null;
  nextSuggestedReview: string | null;
  bookmarked: boolean;
}

export interface FlashcardStateData {
  version: 1;
  cards: Record<string, FlashcardReviewState>;
}

export interface FlashcardFilters {
  technology: string;
  level: FlashcardLevel | 'all';
  category: string;
  mode: FlashcardStudyMode;
}

export interface FlashcardFilterOption<T extends string = string> {
  value: T | 'all';
  label: string;
  count: number;
}
