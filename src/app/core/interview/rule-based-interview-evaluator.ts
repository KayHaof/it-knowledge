import { Injectable } from '@angular/core';
import { InterviewEvaluator } from './interview-evaluator';
import {
  EvaluableInterviewQuestion,
  InterviewDimensionKey,
  InterviewDimensionScore,
  InterviewEvaluation,
  InterviewRubricConcept,
  InterviewRubricMisconception,
  InterviewScoreLabel,
} from './interview-evaluation.models';

interface PreparedAnswer {
  normalized: string;
  tokens: string[];
  tokenSet: ReadonlySet<string>;
  sentenceCount: number;
  uniqueTokenRatio: number;
}

interface ConceptMatch {
  concept: InterviewRubricConcept;
  matched: boolean;
}

interface DimensionDefinition {
  key: InterviewDimensionKey;
  label: string;
  maxScore: number;
}

const DIMENSIONS: readonly DimensionDefinition[] = [
  { key: 'technicalCorrectness', label: 'Độ chính xác kỹ thuật', maxScore: 40 },
  { key: 'completeness', label: 'Mức độ đầy đủ', maxScore: 20 },
  { key: 'reasoning', label: 'Lập luận / giải thích', maxScore: 15 },
  { key: 'production', label: 'Góc nhìn production', maxScore: 10 },
  { key: 'tradeoffs', label: 'Nhận thức trade-off', maxScore: 10 },
  { key: 'communication', label: 'Trình bày', maxScore: 5 },
];

const REASONING_MARKERS = [
  'bởi vì',
  'vì vậy',
  'do đó',
  'dẫn đến',
  'nguyên nhân',
  'khi',
  'nếu',
  'because',
  'therefore',
  'which means',
];

const PRODUCTION_GROUPS: readonly string[][] = [
  ['monitor', 'monitoring', 'metric', 'metrics', 'theo dõi', 'cảnh báo', 'alert'],
  ['timeout', 'retry', 'backoff', 'fallback', 'circuit breaker', 'idempotent', 'idempotency'],
  ['production', 'deploy', 'rollback', 'runbook', 'capacity', 'slo', 'p99', 'load test'],
  ['security', 'bảo mật', 'redact', 'least privilege', 'xác thực', 'phân quyền', 'audit'],
];

const TRADEOFF_GROUPS: readonly string[][] = [
  ['trade off', 'đổi lại', 'tuy nhiên', 'nhưng', 'ưu điểm', 'nhược điểm'],
  ['so với', 'phụ thuộc', 'lựa chọn', 'thay vì', 'khi nào', 'nếu'],
  ['latency', 'throughput', 'consistency', 'availability', 'complexity', 'chi phí', 'memory', 'cpu'],
];

const NEGATIONS = new Set(['khong', 'chua', 'chang', 'not', 'no', 'never', 'without']);

@Injectable({ providedIn: 'root' })
export class RuleBasedInterviewEvaluator implements InterviewEvaluator {
  async evaluate(
    question: EvaluableInterviewQuestion,
    rawAnswer: string,
  ): Promise<InterviewEvaluation> {
    const answer = prepareAnswer(rawAnswer);
    const concepts = collectConcepts(question);
    const matches = concepts.map((concept) => ({
      concept,
      matched: conceptAliases(concept).some((alias) => matchesAlias(answer, alias)),
    }));
    const coverage = weightedCoverage(matches);
    const technicalCoverage = dimensionCoverage(matches, 'technicalCorrectness');

    if (!answer.tokens.length) return emptyEvaluation(matches);

    const misconceptions = collectMisconceptions(question);
    const detectedMisconceptions = misconceptions.filter((item) =>
      misconceptionPatterns(item).some((pattern) => matchesMisconception(answer, pattern)),
    );
    const misconceptionPenalty = Math.min(
      40,
      detectedMisconceptions.reduce((total, item) => total + Math.max(0, item.penalty), 0),
    );

    const technicalBeforePenalty = Math.round(40 * technicalCoverage);
    const technical = Math.max(0, technicalBeforePenalty - misconceptionPenalty);
    const completeness = completenessScore(answer, matches);
    const reasoning = reasoningScore(answer, matches);
    const production = contextualScore(
      answer,
      matches,
      'production',
      PRODUCTION_GROUPS,
      10,
    );
    const tradeoffs = contextualScore(
      answer,
      matches,
      'tradeoffs',
      TRADEOFF_GROUPS,
      10,
    );
    const communication = communicationScore(answer);

    const matchedConcepts = matches.filter((item) => item.matched);
    const missingConcepts = matches.filter((item) => !item.matched);
    const incorrectClaims = detectedMisconceptions.map(misconceptionLabel);
    const dimensions: InterviewDimensionScore[] = [
      dimension(
        'technicalCorrectness',
        technical,
        [
          `${matchedConcepts.length}/${matches.length} khái niệm rubric được nhận diện.`,
          ...(misconceptionPenalty
            ? [`Trừ ${misconceptionPenalty} điểm do phát hiện misconception.`]
            : []),
        ],
      ),
      dimension(
        'completeness',
        completeness,
        [
          `${Math.round(coverage * 100)}% coverage theo trọng số rubric.`,
          `${answer.tokens.length} từ sau chuẩn hóa.`,
        ],
      ),
      dimension(
        'reasoning',
        reasoning,
        [`Nhận diện ${countAliases(answer, REASONING_MARKERS)} dấu hiệu giải thích nguyên nhân/hệ quả.`],
      ),
      dimension(
        'production',
        production,
        [`Đề cập ${countMatchedGroups(answer, PRODUCTION_GROUPS)} nhóm thực hành production.`],
      ),
      dimension(
        'tradeoffs',
        tradeoffs,
        [`Đề cập ${countMatchedGroups(answer, TRADEOFF_GROUPS)} nhóm quyết định/trade-off.`],
      ),
      dimension(
        'communication',
        communication,
        [`${answer.sentenceCount} câu; tỷ lệ từ không lặp ${Math.round(answer.uniqueTokenRatio * 100)}%.`],
      ),
    ];
    const score = clamp(
      dimensions.reduce((total, item) => total + item.score, 0),
      0,
      100,
    );
    const strengths = matchedConcepts.map((item) => conceptLabel(item.concept));
    const missing = missingConcepts.map((item) => conceptLabel(item.concept));

    return {
      score,
      label: scoreLabel(score),
      dimensions,
      strengths,
      missingConcepts: missing,
      incorrectClaims,
      improvements: buildImprovements(dimensions, missing, incorrectClaims),
      reasons: buildTransparentReasons(
        dimensions,
        technicalBeforePenalty,
        misconceptionPenalty,
        incorrectClaims,
      ),
      method: 'rubric-based',
    };
  }
}

export function normalizeInterviewText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/giu, 'd')
    .toLocaleLowerCase('vi')
    .replace(/[^a-z0-9+#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function scoreLabel(score: number): InterviewScoreLabel {
  if (score >= 85) return 'Xuất sắc';
  if (score >= 70) return 'Tốt';
  if (score >= 50) return 'Đạt';
  return 'Yếu';
}

function prepareAnswer(rawAnswer: string): PreparedAnswer {
  const normalized = normalizeInterviewText(rawAnswer);
  const tokens = normalized ? normalized.split(' ') : [];
  const uniqueTokens = new Set(tokens);
  const sentenceCount = rawAnswer
    .split(/[.!?…\n]+/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 3).length;
  return {
    normalized,
    tokens,
    tokenSet: uniqueTokens,
    sentenceCount,
    uniqueTokenRatio: tokens.length ? uniqueTokens.size / tokens.length : 0,
  };
}

function collectConcepts(question: EvaluableInterviewQuestion): InterviewRubricConcept[] {
  const rubric = question.rubric;
  const authored = [
    ...(rubric?.concepts ?? []),
    ...(rubric?.required ?? []).map((concept) => ({ ...concept, required: true })),
    ...(rubric?.recommended ?? []).map((concept) => ({ ...concept, required: false })),
  ];
  const source = authored.length
    ? authored
    : question.topics.map((topic) => ({
        id: topic,
        label: topic,
        aliases: [topic, topic.replace(/[-_/]+/g, ' ')],
        required: true,
      }));
  const byId = new Map<string, InterviewRubricConcept>();
  for (const concept of source) {
    const id = concept.id || concept.label || concept.aliases?.[0];
    if (!id || byId.has(id)) continue;
    byId.set(id, { ...concept, id });
  }
  return [...byId.values()];
}

function collectMisconceptions(
  question: EvaluableInterviewQuestion,
): InterviewRubricMisconception[] {
  const authored = question.rubric?.misconceptions ?? [];
  if (authored.length) return authored;
  return question.wrongAnswer
    ? [
        {
          id: 'common-wrong-answer',
          label: question.wrongAnswer,
          pattern: question.wrongAnswer,
          penalty: 20,
        },
      ]
    : [];
}

function conceptAliases(concept: InterviewRubricConcept): string[] {
  return unique([
    ...(concept.aliases ?? []),
    ...(concept.terms ?? []),
    concept.label ?? '',
    concept.id.replace(/[-_/]+/g, ' '),
  ]).filter(Boolean);
}

function conceptLabel(concept: InterviewRubricConcept): string {
  return concept.label || concept.aliases?.[0] || concept.terms?.[0] || concept.id;
}

function misconceptionPatterns(item: InterviewRubricMisconception): string[] {
  return unique([item.pattern ?? '', ...(item.patterns ?? [])]).filter(Boolean);
}

function misconceptionLabel(item: InterviewRubricMisconception): string {
  return item.label || item.pattern || item.patterns?.[0] || item.id || 'Nhận định sai';
}

function matchesAlias(answer: PreparedAnswer, rawAlias: string): boolean {
  const alias = normalizeInterviewText(rawAlias);
  if (!alias) return false;
  const tokens = alias.split(' ');
  if (tokens.length === 1) return answer.tokenSet.has(tokens[0] ?? '');
  if (containsTokenSequence(answer.tokens, tokens)) return true;
  return tokens.every((token) => answer.tokenSet.has(token));
}

function matchesMisconception(answer: PreparedAnswer, rawPattern: string): boolean {
  const normalized = normalizeInterviewText(rawPattern);
  if (!normalized) return false;
  const patternTokens = normalized.split(' ');
  for (let index = 0; index <= answer.tokens.length - patternTokens.length; index += 1) {
    const slice = answer.tokens.slice(index, index + patternTokens.length);
    if (!slice.every((token, tokenIndex) => token === patternTokens[tokenIndex])) continue;
    const prefix = answer.tokens.slice(Math.max(0, index - 3), index);
    const suffix = answer.tokens.slice(
      index + patternTokens.length,
      index + patternTokens.length + 3,
    );
    const patternIsNegated = patternTokens.some((token) => NEGATIONS.has(token));
    if (
      !patternIsNegated &&
      [...prefix, ...suffix].some((token) => NEGATIONS.has(token))
    ) continue;
    return true;
  }
  return false;
}

function containsTokenSequence(tokens: readonly string[], expected: readonly string[]): boolean {
  for (let index = 0; index <= tokens.length - expected.length; index += 1) {
    if (expected.every((token, tokenIndex) => tokens[index + tokenIndex] === token)) return true;
  }
  return false;
}

function weightedCoverage(matches: readonly ConceptMatch[]): number {
  if (!matches.length) return 0;
  const totalWeight = matches.reduce((total, item) => total + conceptWeight(item.concept), 0);
  const matchedWeight = matches
    .filter((item) => item.matched)
    .reduce((total, item) => total + conceptWeight(item.concept), 0);
  return totalWeight ? matchedWeight / totalWeight : 0;
}

function dimensionCoverage(
  matches: readonly ConceptMatch[],
  key: InterviewDimensionKey,
): number {
  const relevant = matches.filter((item) => (item.concept.points?.[key] ?? 0) > 0);
  if (!relevant.length) return weightedCoverage(matches);
  const total = relevant.reduce((sum, item) => sum + (item.concept.points?.[key] ?? 0), 0);
  const matched = relevant
    .filter((item) => item.matched)
    .reduce((sum, item) => sum + (item.concept.points?.[key] ?? 0), 0);
  return total ? matched / total : 0;
}

function conceptWeight(concept: InterviewRubricConcept): number {
  const authoredPoints = Object.values(concept.points ?? {}).reduce(
    (total, value) => total + Math.max(0, value ?? 0),
    0,
  );
  return Math.max(1, authoredPoints || concept.weight || (concept.required === false ? 1 : 2));
}

function completenessScore(answer: PreparedAnswer, matches: readonly ConceptMatch[]): number {
  const coveragePoints = Math.round(16 * weightedCoverage(matches));
  const lengthPoints = answer.tokens.length >= 50
    ? 4
    : answer.tokens.length >= 30
      ? 3
      : answer.tokens.length >= 15
        ? 2
        : answer.tokens.length >= 8
          ? 1
          : 0;
  return Math.min(20, coveragePoints + lengthPoints);
}

function reasoningScore(answer: PreparedAnswer, matches: readonly ConceptMatch[]): number {
  const authored = scoreFromDimensionConcepts(matches, 'reasoning', 15);
  if (authored !== undefined) return authored;
  const coveragePoints = Math.round(5 * weightedCoverage(matches));
  const markerPoints = Math.min(6, countAliases(answer, REASONING_MARKERS) * 2);
  const structurePoints = answer.tokens.length >= 60
    ? 4
    : answer.tokens.length >= 30
      ? 3
      : answer.tokens.length >= 15
        ? 2
        : answer.tokens.length >= 8
          ? 1
          : 0;
  return Math.min(15, coveragePoints + markerPoints + structurePoints);
}

function contextualScore(
  answer: PreparedAnswer,
  matches: readonly ConceptMatch[],
  key: 'production' | 'tradeoffs',
  groups: readonly string[][],
  maxScore: number,
): number {
  const authored = scoreFromDimensionConcepts(matches, key, maxScore);
  if (authored !== undefined) return authored;
  return Math.round((countMatchedGroups(answer, groups) / groups.length) * maxScore);
}

function scoreFromDimensionConcepts(
  matches: readonly ConceptMatch[],
  key: InterviewDimensionKey,
  maxScore: number,
): number | undefined {
  const relevant = matches.filter((item) => (item.concept.points?.[key] ?? 0) > 0);
  if (!relevant.length) return undefined;
  const total = relevant.reduce((sum, item) => sum + (item.concept.points?.[key] ?? 0), 0);
  const matched = relevant
    .filter((item) => item.matched)
    .reduce((sum, item) => sum + (item.concept.points?.[key] ?? 0), 0);
  return total ? Math.round((matched / total) * maxScore) : 0;
}

function communicationScore(answer: PreparedAnswer): number {
  let score = 1;
  if (answer.tokens.length >= 8) score += 1;
  if (answer.tokens.length >= 20) score += 1;
  if (answer.sentenceCount >= 2) score += 1;
  if (answer.uniqueTokenRatio >= 0.55) score += 1;
  return Math.min(5, score);
}

function countAliases(answer: PreparedAnswer, aliases: readonly string[]): number {
  return aliases.filter((alias) => matchesAlias(answer, alias)).length;
}

function countMatchedGroups(answer: PreparedAnswer, groups: readonly string[][]): number {
  return groups.filter((aliases) => aliases.some((alias) => matchesAlias(answer, alias))).length;
}

function dimension(
  key: InterviewDimensionKey,
  score: number,
  reasons: string[],
): InterviewDimensionScore {
  const definition = DIMENSIONS.find((item) => item.key === key);
  if (!definition) throw new Error(`Unknown interview dimension: ${key}`);
  return {
    key,
    label: definition.label,
    score: clamp(score, 0, definition.maxScore),
    maxScore: definition.maxScore,
    reasons,
  };
}

function emptyEvaluation(matches: readonly ConceptMatch[]): InterviewEvaluation {
  const dimensions = DIMENSIONS.map((item) => ({
    ...item,
    score: 0,
    reasons: ['Chưa có câu trả lời để đánh giá.'],
  }));
  return {
    score: 0,
    label: 'Yếu',
    dimensions,
    strengths: [],
    missingConcepts: matches.map((item) => conceptLabel(item.concept)),
    incorrectClaims: [],
    improvements: ['Viết câu trả lời trước khi yêu cầu đánh giá.'],
    reasons: ['0 điểm: câu trả lời trống.'],
    method: 'rubric-based',
  };
}

function buildImprovements(
  dimensions: readonly InterviewDimensionScore[],
  missing: readonly string[],
  incorrectClaims: readonly string[],
): string[] {
  const improvements: string[] = [];
  if (missing.length) improvements.push(`Bổ sung các ý còn thiếu: ${missing.join(', ')}.`);
  if (incorrectClaims.length) {
    improvements.push('Đối chiếu lại các nhận định sai với đáp án và nguồn chính thức.');
  }
  const score = (key: InterviewDimensionKey) =>
    dimensions.find((item) => item.key === key)?.score ?? 0;
  if (score('reasoning') < 8) {
    improvements.push('Giải thích rõ nguyên nhân, cơ chế và hệ quả thay vì chỉ liệt kê thuật ngữ.');
  }
  if (score('production') < 5) {
    improvements.push('Thêm failure mode, vận hành, quan sát hoặc cách kiểm chứng trong production.');
  }
  if (score('tradeoffs') < 5) {
    improvements.push('Nêu điều kiện lựa chọn và cái giá phải trả của phương án.');
  }
  if (score('communication') < 3) {
    improvements.push('Cấu trúc câu trả lời thành các câu ngắn, rõ và tránh lặp từ.');
  }
  return unique(improvements);
}

function buildTransparentReasons(
  dimensions: readonly InterviewDimensionScore[],
  technicalBeforePenalty: number,
  misconceptionPenalty: number,
  incorrectClaims: readonly string[],
): string[] {
  const reasons = dimensions
    .filter((item) => item.key !== 'technicalCorrectness')
    .map((item) => `+${item.score}/${item.maxScore} ${item.label}`);
  reasons.unshift(`+${technicalBeforePenalty}/40 Độ chính xác kỹ thuật trước penalty`);
  if (misconceptionPenalty) {
    reasons.splice(
      1,
      0,
      `-${misconceptionPenalty} misconception: ${incorrectClaims.join('; ')}`,
    );
  }
  return reasons;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}
