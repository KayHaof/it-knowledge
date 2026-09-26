import { TestBed } from '@angular/core/testing';
import { StorageService } from '../storage/storage.service';
import {
  FLASHCARD_CLOCK,
  FLASHCARD_STORAGE_KEY,
  FlashcardStateService,
} from './flashcard-state.service';

const NOW = new Date('2026-09-26T08:00:00.000Z');

describe('FlashcardStateService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('persists rating fields and restores them through StorageService', () => {
    configure();
    const first = TestBed.inject(FlashcardStateService);
    const reviewed = first.review('java-map', 'good');

    expect(reviewed).toEqual({
      lastReviewed: '2026-09-26T08:00:00.000Z',
      reviewCount: 1,
      lastRating: 'good',
      nextSuggestedReview: '2026-09-29T08:00:00.000Z',
      bookmarked: false,
    });

    TestBed.resetTestingModule();
    configure();
    expect(TestBed.inject(FlashcardStateService).reviewState('java-map')).toEqual(reviewed);
  });

  it('persists bookmarks without pretending an unseen card was reviewed', () => {
    configure();
    const service = TestBed.inject(FlashcardStateService);
    service.toggleBookmark('java-map');

    expect(service.reviewState('java-map')).toEqual({
      lastReviewed: null,
      reviewCount: 0,
      lastRating: null,
      nextSuggestedReview: null,
      bookmarked: true,
    });
    expect(service.isBookmarked('java-map')).toBe(true);
  });

  it('falls back safely for malformed JSON and invalid state shapes', () => {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, '{broken');
    configure();
    expect(TestBed.inject(FlashcardStateService).data()).toEqual({ version: 1, cards: {} });

    TestBed.resetTestingModule();
    localStorage.setItem(
      FLASHCARD_STORAGE_KEY,
      JSON.stringify({ version: 1, cards: { bad: { reviewCount: -4 } } }),
    );
    configure();
    expect(TestBed.inject(FlashcardStateService).data()).toEqual({ version: 1, cards: {} });
  });

  function configure(): void {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        FlashcardStateService,
        { provide: FLASHCARD_CLOCK, useValue: () => new Date(NOW) },
      ],
    });
  }
});
