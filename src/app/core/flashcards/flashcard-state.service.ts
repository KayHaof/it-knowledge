import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import {
  FlashcardRating,
  FlashcardReviewState,
  FlashcardStateData,
} from './flashcard.models';
import { nextSuggestedReview } from './flashcard-schedule';

export type FlashcardClock = () => Date;

export const FLASHCARD_CLOCK = new InjectionToken<FlashcardClock>('FLASHCARD_CLOCK', {
  providedIn: 'root',
  factory: () => () => new Date(),
});

export const FLASHCARD_STORAGE_KEY = 'it-learning-platform:v1:flashcards';

function emptyState(): FlashcardStateData {
  return { version: 1, cards: {} };
}

@Injectable({ providedIn: 'root' })
export class FlashcardStateService {
  private readonly storage = inject(StorageService);
  private readonly clock = inject(FLASHCARD_CLOCK);
  private readonly state = signal(
    normalizeStoredState(this.storage.read<unknown>(FLASHCARD_STORAGE_KEY, emptyState())),
  );

  readonly data = this.state.asReadonly();
  readonly dueCount = computed(() => {
    const now = this.currentTime().getTime();
    return Object.values(this.state().cards).filter((item) => {
      const due = item.nextSuggestedReview ? Date.parse(item.nextSuggestedReview) : Number.NaN;
      return item.reviewCount > 0 && Number.isFinite(due) && due <= now;
    }).length;
  });

  currentTime(): Date {
    return new Date(this.clock().getTime());
  }

  reviewState(cardId: string): FlashcardReviewState | undefined {
    return this.state().cards[cardId];
  }

  isBookmarked(cardId: string): boolean {
    return this.reviewState(cardId)?.bookmarked ?? false;
  }

  toggleBookmark(cardId: string): void {
    const existing = this.reviewState(cardId) ?? createCardState();
    this.updateCard(cardId, { ...existing, bookmarked: !existing.bookmarked });
  }

  review(cardId: string, rating: FlashcardRating): FlashcardReviewState {
    const reviewedAt = this.currentTime();
    const existing = this.reviewState(cardId) ?? createCardState();
    const updated: FlashcardReviewState = {
      ...existing,
      lastReviewed: reviewedAt.toISOString(),
      reviewCount: existing.reviewCount + 1,
      lastRating: rating,
      nextSuggestedReview: nextSuggestedReview(
        rating,
        existing.reviewCount,
        reviewedAt,
      ).toISOString(),
    };
    this.updateCard(cardId, updated);
    return updated;
  }

  clear(): void {
    this.state.set(emptyState());
    this.persist();
  }

  private updateCard(cardId: string, reviewState: FlashcardReviewState): void {
    this.state.update((current) => ({
      ...current,
      cards: { ...current.cards, [cardId]: reviewState },
    }));
    this.persist();
  }

  private persist(): void {
    this.storage.write(FLASHCARD_STORAGE_KEY, this.state());
  }
}

function createCardState(): FlashcardReviewState {
  return {
    lastReviewed: null,
    reviewCount: 0,
    lastRating: null,
    nextSuggestedReview: null,
    bookmarked: false,
  };
}

function normalizeStoredState(value: unknown): FlashcardStateData {
  if (!isRecord(value) || value['version'] !== 1 || !isRecord(value['cards'])) {
    return emptyState();
  }

  const cards: Record<string, FlashcardReviewState> = {};
  for (const [cardId, candidate] of Object.entries(value['cards'])) {
    const normalized = normalizeReviewState(candidate);
    if (cardId && normalized) cards[cardId] = normalized;
  }
  return { version: 1, cards };
}

function normalizeReviewState(value: unknown): FlashcardReviewState | undefined {
  if (!isRecord(value)) return undefined;
  const reviewCount = value['reviewCount'];
  const lastRating = value['lastRating'];
  const lastReviewed = nullableIsoDate(value['lastReviewed']);
  const nextReview = nullableIsoDate(value['nextSuggestedReview']);
  if (
    typeof reviewCount !== 'number' ||
    !Number.isInteger(reviewCount) ||
    reviewCount < 0 ||
    !isRatingOrNull(lastRating) ||
    lastReviewed === undefined ||
    nextReview === undefined ||
    typeof value['bookmarked'] !== 'boolean'
  ) {
    return undefined;
  }
  return {
    lastReviewed,
    reviewCount,
    lastRating,
    nextSuggestedReview: nextReview,
    bookmarked: value['bookmarked'],
  };
}

function nullableIsoDate(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return undefined;
  return value;
}

function isRatingOrNull(value: unknown): value is FlashcardRating | null {
  return (
    value === null ||
    value === 'again' ||
    value === 'hard' ||
    value === 'good' ||
    value === 'easy'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
