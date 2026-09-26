import { TestBed } from '@angular/core/testing';
import { StorageService } from '../storage/storage.service';
import {
  EvaluableInterviewQuestion,
  InterviewEvaluation,
} from './interview-evaluation.models';
import { InterviewHistoryService } from './interview-history.service';

describe('InterviewHistoryService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [InterviewHistoryService, StorageService] });
  });

  it('stores answer, result and timestamp in versioned local storage', () => {
    const service = TestBed.inject(InterviewHistoryService);
    service.add(
      question(),
      'Câu trả lời của tôi',
      evaluation(),
      new Date('2026-09-26T08:00:00.000Z'),
    );

    expect(service.entries()).toHaveLength(1);
    expect(service.entries()[0]).toMatchObject({
      questionId: 'java-memory',
      technology: 'java',
      difficulty: 'middle',
      answer: 'Câu trả lời của tôi',
      timestamp: '2026-09-26T08:00:00.000Z',
      evaluation: { score: 72, label: 'Tốt' },
    });
    expect(
      JSON.parse(localStorage.getItem('it-learning-platform:v1:interview-history') ?? '{}'),
    ).toMatchObject({ version: 1, entries: [{ questionId: 'java-memory' }] });
  });

  it('restores valid history and clears it explicitly', () => {
    const first = TestBed.inject(InterviewHistoryService);
    first.add(question(), 'Một câu trả lời', evaluation());
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [InterviewHistoryService, StorageService] });

    const restored = TestBed.inject(InterviewHistoryService);
    expect(restored.entries()).toHaveLength(1);
    restored.clear();
    expect(restored.entries()).toEqual([]);
    expect(
      JSON.parse(localStorage.getItem('it-learning-platform:v1:interview-history') ?? '{}'),
    ).toEqual({ version: 1, entries: [] });
  });

  it('normalizes history written before technology was stored', () => {
    localStorage.setItem(
      'it-learning-platform:v1:interview-history',
      JSON.stringify({
        version: 1,
        entries: [
          {
            questionId: 'legacy-question',
            question: 'Legacy question?',
            category: 'Java',
            difficulty: 'middle',
            answer: 'Legacy answer',
            evaluation: evaluation(),
            timestamp: '2026-09-25T08:00:00.000Z',
          },
        ],
      }),
    );

    const service = TestBed.inject(InterviewHistoryService);
    expect(service.entries()[0]).toMatchObject({
      questionId: 'legacy-question',
      technology: 'Java',
      category: 'Java',
      difficulty: 'middle',
    });
  });
});

function question(): EvaluableInterviewQuestion {
  return {
    id: 'java-memory',
    technology: 'java',
    category: 'Java',
    difficulty: 'middle',
    topics: ['jvm'],
    question: 'JVM memory hoạt động thế nào?',
    answer30s: 'Tóm tắt.',
    answerDetailed: 'Chi tiết.',
    answer2m: 'Chi tiết.',
    production: 'Metrics.',
    tradeoffs: 'Độ trễ và throughput.',
    wrongAnswer: 'Sai.',
    followUps: ['Một?', 'Hai?'],
    relatedLessons: ['java-jvm-memory'],
    relatedLesson: '/learn/backend/java-jvm-memory',
    sources: [],
    rubric: {
      dimensions: {
        technicalCorrectness: 40,
        completeness: 20,
        reasoning: 15,
        production: 10,
        tradeoffs: 10,
        communication: 5,
      },
      concepts: [],
      misconceptions: [],
    },
  };
}

function evaluation(): InterviewEvaluation {
  return {
    score: 72,
    label: 'Tốt',
    dimensions: [],
    strengths: ['jvm'],
    missingConcepts: [],
    incorrectClaims: [],
    improvements: [],
    reasons: [],
    method: 'rubric-based',
  };
}
