import { intervalMilliseconds, nextSuggestedReview } from './flashcard-schedule';

const DAY = 24 * 60 * 60 * 1000;

describe('flashcard review schedule', () => {
  it('uses transparent initial intervals for every rating', () => {
    expect(intervalMilliseconds('again', 0)).toBe(10 * 60 * 1000);
    expect(intervalMilliseconds('hard', 0)).toBe(DAY);
    expect(intervalMilliseconds('good', 0)).toBe(3 * DAY);
    expect(intervalMilliseconds('easy', 0)).toBe(7 * DAY);
  });

  it('grows successful intervals deterministically and caps them', () => {
    expect(intervalMilliseconds('hard', 99)).toBe(7 * DAY);
    expect(intervalMilliseconds('good', 2)).toBe(12 * DAY);
    expect(intervalMilliseconds('good', 99)).toBe(60 * DAY);
    expect(intervalMilliseconds('easy', 2)).toBe(28 * DAY);
    expect(intervalMilliseconds('easy', 99)).toBe(120 * DAY);
  });

  it('calculates from the supplied clock instead of wall-clock time', () => {
    const reviewedAt = new Date('2026-09-26T08:00:00.000Z');
    expect(nextSuggestedReview('again', 5, reviewedAt).toISOString()).toBe(
      '2026-09-26T08:10:00.000Z',
    );
    expect(reviewedAt.toISOString()).toBe('2026-09-26T08:00:00.000Z');
  });
});
