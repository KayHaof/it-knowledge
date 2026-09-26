import { TestBed } from '@angular/core/testing';
import { LearningStateService } from './learning-state.service';

describe('LearningStateService', () => {
  let service: LearningStateService;
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({}); service = TestBed.inject(LearningStateService); });

  it('tracks progress and bookmarks without duplicates', () => {
    service.setProgress('java-jvm-memory', 'completed');
    service.toggleBookmark('java-jvm-memory'); service.toggleBookmark('java-jvm-memory');
    expect(service.completedCount()).toBe(1);
    expect(service.isBookmarked('java-jvm-memory')).toBe(false);
  });

  it('keeps only fifteen unique recent lessons', () => {
    for (let index = 0; index < 20; index++) service.addRecent(`lesson-${index}`);
    service.addRecent('lesson-10');
    expect(service.data().recent).toHaveLength(15);
    expect(service.data().recent[0]).toBe('lesson-10');
  });

  it('rejects an unknown import schema', () => {
    expect(service.importData('{"version":2}')).toBe(false);
  });

  it('migrates the three interview IDs that collided with lesson IDs', () => {
    const imported = {
      version: 1,
      progress: {},
      bookmarks: [],
      recent: [],
      masteredQuestions: ['system-design-job-scheduler'],
      reviewQuestions: ['system-design-payment-ledger'],
      settings: { theme: 'system' },
    };
    expect(service.importData(JSON.stringify(imported))).toBe(true);
    expect(service.isMastered('interview-system-design-job-scheduler')).toBe(true);
    expect(service.isForReview('interview-system-design-payment-ledger')).toBe(true);
  });
});
