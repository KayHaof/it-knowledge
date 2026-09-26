import {
  EvaluableInterviewQuestion,
  InterviewEvaluation,
} from './interview-evaluation.models';

export interface InterviewEvaluator {
  evaluate(
    question: EvaluableInterviewQuestion,
    answer: string,
  ): Promise<InterviewEvaluation>;
}
