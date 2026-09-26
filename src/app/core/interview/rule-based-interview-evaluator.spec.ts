import { EvaluableInterviewQuestion } from './interview-evaluation.models';
import {
  normalizeInterviewText,
  RuleBasedInterviewEvaluator,
  scoreLabel,
} from './rule-based-interview-evaluator';

describe('RuleBasedInterviewEvaluator', () => {
  const evaluator = new RuleBasedInterviewEvaluator();

  it('scores full rubric coverage across all six dimensions', async () => {
    const evaluation = await evaluator.evaluate(question(), excellentAnswer());

    expect(evaluation.score).toBe(100);
    expect(evaluation.label).toBe('Xuất sắc');
    expect(evaluation.dimensions.map((item) => [item.key, item.maxScore])).toEqual([
      ['technicalCorrectness', 40],
      ['completeness', 20],
      ['reasoning', 15],
      ['production', 10],
      ['tradeoffs', 10],
      ['communication', 5],
    ]);
    expect(evaluation.missingConcepts).toEqual([]);
    expect(evaluation.strengths).toContain('Ordering trong partition');
  });

  it('returns partial coverage and names missing concepts', async () => {
    const evaluation = await evaluator.evaluate(
      question(),
      'Kafka giữ thứ tự trong từng phân vùng.',
    );

    expect(evaluation.score).toBeGreaterThan(0);
    expect(evaluation.score).toBeLessThan(70);
    expect(evaluation.missingConcepts).toContain('Không có global ordering');
    expect(evaluation.improvements.join(' ')).toContain('Bổ sung');
  });

  it('normalizes Vietnamese accents, punctuation and authored synonyms', async () => {
    const evaluation = await evaluator.evaluate(
      question(),
      'PHAN-VUNG giữ ordering; toàn topic KHÔNG có global-order.',
    );

    expect(normalizeInterviewText('Phân-vùng, THỨ TỰ!')).toBe('phan vung thu tu');
    expect(evaluation.strengths).toContain('Ordering trong partition');
    expect(evaluation.strengths).toContain('Không có global ordering');
  });

  it('applies an authored misconception penalty but respects explicit negation', async () => {
    const correct = await evaluator.evaluate(question(), excellentAnswer());
    const incorrect = await evaluator.evaluate(
      question(),
      excellentAnswer() + ' Kafka đảm bảo thứ tự toàn bộ topic.',
    );
    const negated = await evaluator.evaluate(
      question(),
      excellentAnswer() + ' Kafka không đảm bảo thứ tự toàn bộ topic.',
    );

    expect(incorrect.score).toBe(correct.score - 20);
    expect(incorrect.incorrectClaims).toEqual(['Global topic ordering']);
    expect(incorrect.reasons.some((reason) => reason.startsWith('-20'))).toBe(true);
    expect(negated.incorrectClaims).toEqual([]);
  });

  it('handles an empty answer and keeps every score inside its bounds', async () => {
    const empty = await evaluator.evaluate(question(), '   ');
    const repeated = await evaluator.evaluate(question(), 'partition '.repeat(500));

    expect(empty.score).toBe(0);
    expect(empty.label).toBe('Yếu');
    expect(empty.dimensions.every((item) => item.score === 0)).toBe(true);
    expect(repeated.score).toBeGreaterThanOrEqual(0);
    expect(repeated.score).toBeLessThanOrEqual(100);
    expect(
      repeated.dimensions.every(
        (item) => item.score >= 0 && item.score <= item.maxScore,
      ),
    ).toBe(true);
  });

  it('grades a legacy generated question without authored rubric metadata', async () => {
    const legacy = {
      id: 'legacy-java',
      category: 'Java',
      difficulty: 'junior',
      topics: ['hashmap', 'collision'],
      question: 'HashMap xử lý collision thế nào?',
      answer30s: 'Bucket giữ entry bị collision.',
      answer2m: 'Hash và equals tìm entry đúng.',
      production: 'Theo dõi memory.',
      wrongAnswer: 'HashMap không có collision.',
      followUps: ['Resize?', 'Treeification?'],
      relatedLesson: '/learn/backend/hashmap',
    } as unknown as EvaluableInterviewQuestion;

    const evaluation = await evaluator.evaluate(
      legacy,
      'HashMap có collision trong bucket vì nhiều key có thể cùng hash.',
    );

    expect(evaluation.score).toBeGreaterThan(0);
    expect(evaluation.strengths).toEqual(expect.arrayContaining(['hashmap', 'collision']));
    expect(evaluation.method).toBe('rubric-based');
  });

  it('returns deterministic output and stable Vietnamese labels', async () => {
    const first = await evaluator.evaluate(question(), excellentAnswer());
    const second = await evaluator.evaluate(question(), excellentAnswer());

    expect(second).toEqual(first);
    expect([0, 49, 50, 69, 70, 84, 85, 100].map(scoreLabel)).toEqual([
      'Yếu',
      'Yếu',
      'Đạt',
      'Đạt',
      'Tốt',
      'Tốt',
      'Xuất sắc',
      'Xuất sắc',
    ]);
  });
});

function question(): EvaluableInterviewQuestion {
  return {
    id: 'kafka-ordering',
    technology: 'kafka',
    category: 'Kafka',
    difficulty: 'senior',
    topics: ['partition', 'ordering'],
    question: 'Kafka đảm bảo ordering như thế nào?',
    answer30s: 'Kafka chỉ giữ ordering trong một partition.',
    answerDetailed: 'Không có global ordering; key strategy quyết định partition.',
    answer2m: 'Không có global ordering; key strategy quyết định partition.',
    production: 'Theo dõi metrics, alert và retry có idempotency.',
    tradeoffs: 'Đổi lại giữa throughput, latency và ordering.',
    wrongAnswer: 'Kafka đảm bảo thứ tự toàn bộ topic.',
    followUps: ['Key ảnh hưởng gì?', 'Retry ảnh hưởng gì?'],
    relatedLessons: ['kafka-ordering'],
    relatedLesson: '/learn/messaging/kafka-ordering',
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
      concepts: [
        {
          id: 'partition-ordering',
          label: 'Ordering trong partition',
          aliases: ['ordering trong partition', 'phân vùng giữ ordering'],
          required: true,
          points: { technicalCorrectness: 20 },
        },
        {
          id: 'no-global-order',
          label: 'Không có global ordering',
          aliases: ['không có global ordering', 'toàn topic không có global order'],
          required: true,
          points: { technicalCorrectness: 20 },
        },
        {
          id: 'key-strategy',
          label: 'Key strategy',
          aliases: ['key strategy', 'khóa chọn partition'],
          required: false,
          points: { completeness: 10 },
        },
      ],
      misconceptions: [
        {
          id: 'global-order',
          label: 'Global topic ordering',
          patterns: ['kafka đảm bảo thứ tự toàn bộ topic'],
          penalty: 20,
        },
      ],
    },
  };
}

function excellentAnswer(): string {
  return [
    'Kafka giữ ordering trong partition, nhưng không có global ordering cho toàn topic.',
    'Bởi vì key strategy chọn partition nên cùng key mới có thứ tự ổn định; do đó cần chọn khóa theo invariant.',
    'Trong production tôi theo dõi metric, alert và audit; timeout, retry, backoff cùng idempotency bảo vệ failure.',
    'Khi deploy cần rollback, runbook, capacity, SLO và load test; security cần least privilege.',
    'Trade-off là throughput, latency, consistency và complexity: lựa chọn nhiều partition đổi lại khả năng ordering toàn cục.',
  ].join(' ');
}
