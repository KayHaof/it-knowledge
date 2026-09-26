import {
  FLASHCARD_LEVELS,
  Flashcard,
  FlashcardFilterOption,
  FlashcardFilters,
  FlashcardLevel,
  FlashcardReviewState,
  FlashcardStudyMode,
} from './flashcard.models';
import { LEARNING_LEVEL_LABELS } from '../constants/learning-levels';

const MODE_LABELS: Readonly<Record<FlashcardStudyMode, string>> = {
  all: 'Tất cả',
  due: 'Đến hạn',
  new: 'Mới',
  bookmarked: 'Đã lưu',
  difficult: 'Khó',
};

export function filterFlashcards(
  cards: readonly Flashcard[],
  filters: FlashcardFilters,
  reviewStates: Readonly<Record<string, FlashcardReviewState>>,
  now: Date,
): Flashcard[] {
  return cards.filter((card) => {
    const metadataMatches =
      matches(filters.technology, card.technology) &&
      (filters.level === 'all' || card.level === filters.level) &&
      matches(filters.category, card.category);
    return metadataMatches && matchesMode(filters.mode, reviewStates[card.id], now);
  });
}

export function buildTechnologyOptions(
  cards: readonly Flashcard[],
): FlashcardFilterOption[] {
  return buildTextOptions(cards, (card) => card.technology);
}

export function buildCategoryOptions(cards: readonly Flashcard[]): FlashcardFilterOption[] {
  return buildTextOptions(cards, (card) => card.category);
}

export function buildLevelOptions(
  cards: readonly Flashcard[],
): FlashcardFilterOption<FlashcardLevel>[] {
  return [
    { value: 'all', label: 'Tất cả', count: cards.length },
    ...FLASHCARD_LEVELS.filter((level) => cards.some((card) => card.level === level)).map(
      (level) => ({
        value: level,
        label: LEARNING_LEVEL_LABELS[level],
        count: cards.filter((card) => card.level === level).length,
      }),
    ),
  ];
}

export function buildModeOptions(
  cards: readonly Flashcard[],
  reviewStates: Readonly<Record<string, FlashcardReviewState>>,
  now: Date,
): FlashcardFilterOption<FlashcardStudyMode>[] {
  const modes: readonly FlashcardStudyMode[] = [
    'all',
    'due',
    'new',
    'bookmarked',
    'difficult',
  ];
  return modes.map((mode) => ({
    value: mode,
    label: MODE_LABELS[mode],
    count: cards.filter((card) => matchesMode(mode, reviewStates[card.id], now)).length,
  }));
}

export function isDue(state: FlashcardReviewState | undefined, now: Date): boolean {
  if (!state || state.reviewCount < 1 || !state.nextSuggestedReview) return false;
  const dueAt = Date.parse(state.nextSuggestedReview);
  return Number.isFinite(dueAt) && dueAt <= now.getTime();
}

function matchesMode(
  mode: FlashcardStudyMode,
  state: FlashcardReviewState | undefined,
  now: Date,
): boolean {
  if (mode === 'all') return true;
  if (mode === 'due') return isDue(state, now);
  if (mode === 'new') return !state || state.reviewCount === 0;
  if (mode === 'bookmarked') return state?.bookmarked === true;
  return state?.lastRating === 'again' || state?.lastRating === 'hard';
}

function buildTextOptions(
  cards: readonly Flashcard[],
  select: (card: Flashcard) => string,
): FlashcardFilterOption[] {
  const values = new Map<string, string>();
  for (const card of cards) {
    const label = select(card).trim();
    if (label) values.set(normalize(label), label);
  }
  const options = [...values.entries()]
    .map(([value, label]) => ({
      value,
      label,
      count: cards.filter((card) => normalize(select(card)) === value).length,
    }))
    .sort((left, right) => left.label.localeCompare(right.label, 'vi'));
  return [{ value: 'all', label: 'Tất cả', count: cards.length }, ...options];
}

function matches(selected: string, actual: string): boolean {
  return selected === 'all' || normalize(actual) === normalize(selected);
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')
    .replace(/[^a-z0-9+#.]+/g, '-')
    .replace(/^-|-$/g, '');
}
