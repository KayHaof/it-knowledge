import {
  buildCategoryOptions,
  buildLevelOptions,
  buildModeOptions,
  buildTechnologyOptions,
  filterFlashcards,
  isDue,
} from './flashcard-filtering';
import {
  Flashcard,
  FlashcardFilters,
  FlashcardReviewState,
} from './flashcard.models';

const NOW = new Date('2026-09-26T08:00:00.000Z');

describe('flashcard filtering', () => {
  it('derives technology, level and category options from card metadata', () => {
    expect(buildTechnologyOptions(cards()).map((item) => [item.value, item.count])).toEqual([
      ['all', 4],
      ['java', 2],
      ['spring', 2],
    ]);
    expect(buildLevelOptions(cards()).map((item) => [item.value, item.count])).toEqual([
      ['all', 4],
      ['basic', 1],
      ['advanced', 2],
      ['extended', 1],
    ]);
    expect(buildCategoryOptions(cards()).map((item) => item.label)).toEqual([
      'Tất cả',
      'Collections',
      'Core',
      'Production',
    ]);
  });

  it('composes all metadata dimensions', () => {
    const filters: FlashcardFilters = {
      technology: 'java',
      level: 'advanced',
      category: 'collections',
      mode: 'all',
    };
    expect(filterFlashcards(cards(), filters, {}, NOW).map((card) => card.id)).toEqual([
      'java-map',
    ]);
  });

  it('separates due, new, bookmarked and difficult study modes', () => {
    const states: Record<string, FlashcardReviewState> = {
      'java-map': state('hard', '2026-09-25T08:00:00.000Z', true),
      'spring-di': state('good', '2026-10-01T08:00:00.000Z', false),
      'spring-prod': state('again', '2026-09-26T07:59:00.000Z', false),
    };
    const base: Omit<FlashcardFilters, 'mode'> = {
      technology: 'all',
      level: 'all',
      category: 'all',
    };

    expect(filterFlashcards(cards(), { ...base, mode: 'due' }, states, NOW).map(id)).toEqual([
      'java-map',
      'spring-prod',
    ]);
    expect(filterFlashcards(cards(), { ...base, mode: 'new' }, states, NOW).map(id)).toEqual([
      'java-basic',
    ]);
    expect(filterFlashcards(cards(), { ...base, mode: 'bookmarked' }, states, NOW).map(id)).toEqual([
      'java-map',
    ]);
    expect(filterFlashcards(cards(), { ...base, mode: 'difficult' }, states, NOW).map(id)).toEqual([
      'java-map',
      'spring-prod',
    ]);

    expect(buildModeOptions(cards(), states, NOW).map((item) => [item.value, item.count])).toEqual([
      ['all', 4],
      ['due', 2],
      ['new', 1],
      ['bookmarked', 1],
      ['difficult', 2],
    ]);
  });

  it('does not treat malformed or never-reviewed timestamps as due', () => {
    expect(isDue(undefined, NOW)).toBe(false);
    expect(isDue({ ...state('good', 'bad-date', false), reviewCount: 0 }, NOW)).toBe(false);
    expect(isDue({ ...state('good', 'bad-date', false), nextSuggestedReview: 'bad-date' }, NOW)).toBe(false);
  });
});

function id(card: Flashcard): string {
  return card.id;
}

function state(
  rating: FlashcardReviewState['lastRating'],
  nextSuggestedReview: string,
  bookmarked: boolean,
): FlashcardReviewState {
  return {
    lastReviewed: '2026-09-20T08:00:00.000Z',
    reviewCount: 1,
    lastRating: rating,
    nextSuggestedReview,
    bookmarked,
  };
}

function cards(): Flashcard[] {
  return [
    card('java-basic', 'Java', 'basic', 'Core'),
    card('java-map', 'Java', 'advanced', 'Collections'),
    card('spring-di', 'Spring', 'advanced', 'Core'),
    card('spring-prod', 'Spring', 'extended', 'Production'),
  ];
}

function card(
  idValue: string,
  technology: string,
  level: Flashcard['level'],
  category: string,
): Flashcard {
  return {
    id: idValue,
    technology,
    level,
    category,
    front: idValue,
    back: idValue + ' answer',
    tags: [],
    generated: false,
    sourceLesson: idValue + '-lesson',
    sourcePath: '/learn/test/' + idValue,
  };
}
