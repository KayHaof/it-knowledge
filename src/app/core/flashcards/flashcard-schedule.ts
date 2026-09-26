import { FlashcardRating } from './flashcard.models';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/**
 * Small, deliberately transparent review schedule (not a claim of scientific optimality):
 * Again = 10 minutes; Hard = 1..7 days; Good = 3 days doubling up to 60;
 * Easy = 7 days doubling up to 120. `completedReviews` is the count before this rating.
 */
export function nextSuggestedReview(
  rating: FlashcardRating,
  completedReviews: number,
  reviewedAt: Date,
): Date {
  const reviews = Math.max(0, Math.floor(completedReviews));
  const interval = intervalMilliseconds(rating, reviews);
  return new Date(reviewedAt.getTime() + interval);
}

export function intervalMilliseconds(
  rating: FlashcardRating,
  completedReviews: number,
): number {
  const reviews = Math.max(0, Math.floor(completedReviews));
  if (rating === 'again') return 10 * MINUTE;
  if (rating === 'hard') return Math.min(7, reviews + 1) * DAY;
  if (rating === 'good') return Math.min(60, 3 * 2 ** Math.min(reviews, 5)) * DAY;
  return Math.min(120, 7 * 2 ** Math.min(reviews, 5)) * DAY;
}
