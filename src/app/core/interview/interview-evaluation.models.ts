import { InterviewQuestion } from '../models/content.models';

export type InterviewDimensionKey =
  | 'technicalCorrectness'
  | 'completeness'
  | 'reasoning'
  | 'production'
  | 'tradeoffs'
  | 'communication';

export type InterviewScoreLabel = 'Yếu' | 'Đạt' | 'Tốt' | 'Xuất sắc';

export interface InterviewRubricConcept {
  id: string;
  label?: string;
  aliases?: string[];
  terms?: string[];
  required?: boolean;
  weight?: number;
  points?: Partial<Record<InterviewDimensionKey, number>>;
}

export interface InterviewRubricMisconception {
  id?: string;
  label?: string;
  pattern?: string;
  patterns?: string[];
  penalty: number;
}

export interface InterviewRubric {
  dimensions?: Partial<
    Record<InterviewDimensionKey, number | { weight: number }>
  >;
  concepts?: InterviewRubricConcept[];
  required?: InterviewRubricConcept[];
  recommended?: InterviewRubricConcept[];
  misconceptions?: InterviewRubricMisconception[];
}

/**
 * Backward-compatible runtime shape while the generated interview schema is migrated.
 * Legacy artifacts use answer2m/relatedLesson; new Markdown artifacts can add the
 * richer fields without making the interview UI depend on the content compiler.
 */
export type EvaluableInterviewQuestion = InterviewQuestion & {
  technology?: string;
  answerDetailed?: string;
  tradeoffs?: string | string[];
  relatedLessons?: string[];
  rubric?: InterviewRubric;
};

export interface InterviewDimensionScore {
  key: InterviewDimensionKey;
  label: string;
  score: number;
  maxScore: number;
  reasons: string[];
}

export interface InterviewEvaluation {
  score: number;
  label: InterviewScoreLabel;
  dimensions: InterviewDimensionScore[];
  strengths: string[];
  missingConcepts: string[];
  incorrectClaims: string[];
  improvements: string[];
  reasons: string[];
  method: 'rubric-based';
}

export interface InterviewHistoryEntry {
  questionId: string;
  question: string;
  technology: string;
  category: string;
  difficulty: InterviewQuestion['difficulty'];
  answer: string;
  evaluation: InterviewEvaluation;
  timestamp: string;
}
