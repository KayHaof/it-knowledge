import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  EvaluableInterviewQuestion,
  InterviewEvaluation,
  InterviewHistoryEntry,
} from '../../core/interview/interview-evaluation.models';
import { InterviewHistoryService } from '../../core/interview/interview-history.service';
import {
  normalizeInterviewText,
  RuleBasedInterviewEvaluator,
} from '../../core/interview/rule-based-interview-evaluator';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';

interface InterviewFilterOption { value: string; label: string; count: number }

const DIFFICULTIES: readonly InterviewFilterOption[] = [
  { value: 'junior', label: 'Junior', count: 0 },
  { value: 'middle', label: 'Middle', count: 0 },
  { value: 'senior', label: 'Senior', count: 0 },
  { value: 'system-design', label: 'System Design', count: 0 },
];

const DIFFICULTY_LABELS: Readonly<Record<EvaluableInterviewQuestion['difficulty'], string>> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
  'system-design': 'System Design',
};

@Component({
  selector: 'app-interview',
  imports: [RouterLink],
  templateUrl: './interview.html',
  styleUrl: './interview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Interview implements OnInit {
  private readonly repository = inject(ContentRepository);
  private readonly router = inject(Router);
  private readonly evaluator = inject(RuleBasedInterviewEvaluator);
  private readonly history = inject(InterviewHistoryService);
  protected readonly state = inject(LearningStateService);

  readonly category = input('all');
  readonly difficulty = input('all');
  readonly questionId = input<string | undefined>('');
  protected readonly questions = signal<EvaluableInterviewQuestion[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly index = signal(0);
  protected readonly answerVisible = signal(false);
  protected readonly activeFollowUp = signal<string | null>(null);
  protected readonly draftAnswer = signal('');
  protected readonly evaluation = signal<InterviewEvaluation | null>(null);
  protected readonly evaluating = signal(false);
  protected readonly evaluationError = signal('');
  protected readonly confirmingClearHistory = signal(false);
  protected readonly historyEntries = this.history.entries;

  protected readonly categoryOptions = computed<InterviewFilterOption[]>(() => {
    const difficulty = this.normalizedDifficulty();
    const scoped = this.questions().filter((question) => difficulty === 'all' || question.difficulty === difficulty);
    const labels = new Map<string, string>();
    for (const question of scoped) labels.set(question.category.toLowerCase(), question.category);
    const options = [...labels.entries()]
      .map(([value, label]) => ({ value, label, count: scoped.filter((question) => question.category.toLowerCase() === value).length }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'vi'));
    return [{ value: 'all', label: 'Tất cả', count: scoped.length }, ...options];
  });

  protected readonly difficultyOptions = computed<InterviewFilterOption[]>(() => {
    const category = this.normalizedCategory();
    const scoped = this.questions().filter((question) => category === 'all' || question.category.toLowerCase() === category);
    const options = DIFFICULTIES
      .map((option) => ({ ...option, count: scoped.filter((question) => question.difficulty === option.value).length }))
      .filter((option) => option.count > 0);
    return [{ value: 'all', label: 'Tất cả', count: scoped.length }, ...options];
  });

  protected readonly filtered = computed(() => {
    const category = this.normalizedCategory();
    const difficulty = this.normalizedDifficulty();
    return this.questions().filter((question) =>
      (category === 'all' || question.category.toLowerCase() === category) &&
      (difficulty === 'all' || question.difficulty === difficulty),
    );
  });

  protected readonly current = computed(() => {
    const filtered = this.filtered();
    return filtered[Math.min(this.index(), Math.max(0, filtered.length - 1))];
  });

  constructor() {
    effect(() => {
      this.category();
      this.difficulty();
      const requestedQuestionId = (this.questionId() ?? '').trim();
      const requestedIndex = requestedQuestionId
        ? this.filtered().findIndex((question) => question.id === requestedQuestionId)
        : -1;
      this.index.set(requestedIndex >= 0 ? requestedIndex : 0);
    });
    effect(() => {
      if (this.current() || !this.loading()) this.resetAttempt();
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.questions.set(
        (await this.repository.interviewQuestions()) as EvaluableInterviewQuestion[],
      );
    } catch {
      this.error.set(this.repository.loadError() || 'Không thể tải bộ câu hỏi phỏng vấn.');
    } finally {
      this.loading.set(false);
    }
  }

  protected setCategory(value: string): void {
    this.navigateFilters(value, this.normalizedDifficulty());
  }

  protected setDifficulty(value: string): void {
    this.navigateFilters(this.normalizedCategory(), value);
  }

  protected move(delta: number): void {
    const total = this.filtered().length;
    if (!total) return;
    this.index.set((this.index() + delta + total) % total);
    this.resetAttempt();
  }

  protected random(): void {
    const total = this.filtered().length;
    if (total) this.index.set(Math.floor(Math.random() * total));
    this.resetAttempt();
  }

  protected updateDraft(event: Event): void {
    this.draftAnswer.set((event.target as HTMLTextAreaElement).value);
    if (this.evaluation()) {
      this.evaluation.set(null);
      this.answerVisible.set(false);
    }
    this.evaluationError.set('');
  }

  protected async submitAnswer(): Promise<void> {
    const question = this.current();
    const answer = this.draftAnswer().trim();
    if (!question || !answer || this.evaluating() || this.activeFollowUp()) return;

    this.evaluating.set(true);
    this.evaluationError.set('');
    try {
      const evaluation = await this.evaluator.evaluate(question, answer);
      if (this.current()?.id !== question.id) return;
      this.evaluation.set(evaluation);
      this.answerVisible.set(true);
      this.history.add(question, answer, evaluation);
    } catch {
      this.evaluationError.set('Không thể đánh giá câu trả lời lúc này.');
    } finally {
      this.evaluating.set(false);
    }
  }

  protected requestClearHistory(): void {
    this.confirmingClearHistory.set(true);
  }

  protected cancelClearHistory(): void {
    this.confirmingClearHistory.set(false);
  }

  protected clearHistory(): void {
    this.history.clear();
    this.confirmingClearHistory.set(false);
  }

  protected detailedAnswer(question: EvaluableInterviewQuestion): string {
    return question.answerDetailed || question.answer2m || '';
  }

  protected tradeoffsText(question: EvaluableInterviewQuestion): string {
    return Array.isArray(question.tradeoffs)
      ? question.tradeoffs.join(' ')
      : question.tradeoffs ?? '';
  }

  protected relatedLessonIds(question: EvaluableInterviewQuestion): string[] {
    return question.relatedLessons ?? [];
  }

  protected relatedLessonLinks(
    question: EvaluableInterviewQuestion,
  ): { id: string; title: string; path: string }[] {
    return question.relatedLessonLinks ?? [];
  }

  protected followUpTarget(
    followUp: string,
    currentQuestion: EvaluableInterviewQuestion,
  ): EvaluableInterviewQuestion | undefined {
    return findFollowUpQuestion(followUp, this.questions(), currentQuestion);
  }

  protected followUpQueryParams(question: EvaluableInterviewQuestion): Record<string, string> {
    return {
      category: question.category.toLowerCase(),
      difficulty: question.difficulty,
      questionId: question.id,
    };
  }

  protected practiceFollowUp(followUp: string): void {
    this.resetAttempt();
    this.activeFollowUp.set(followUp);
  }

  protected returnToMainQuestion(): void {
    this.resetAttempt();
  }

  protected difficultyLabel(difficulty: EvaluableInterviewQuestion['difficulty']): string {
    return DIFFICULTY_LABELS[difficulty];
  }

  protected formatTimestamp(entry: InterviewHistoryEntry): string {
    const date = new Date(entry.timestamp);
    if (Number.isNaN(date.getTime())) return entry.timestamp;
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  }

  private navigateFilters(category: string, difficulty: string): void {
    void this.router.navigate(['/interview'], {
      queryParams: {
        category: category === 'all' ? null : category,
        difficulty: difficulty === 'all' ? null : difficulty,
        questionId: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected normalizedCategory(): string {
    const value = (this.category() ?? 'all').trim().toLowerCase();
    return value === 'all' || this.questions().some((question) => question.category.toLowerCase() === value) ? value : 'all';
  }

  protected normalizedDifficulty(): string {
    const value = (this.difficulty() ?? 'all').trim().toLowerCase();
    return value === 'all' || DIFFICULTIES.some((option) => option.value === value) ? value : 'all';
  }

  private resetAttempt(): void {
    this.activeFollowUp.set(null);
    this.draftAnswer.set('');
    this.evaluation.set(null);
    this.evaluationError.set('');
    this.evaluating.set(false);
    this.answerVisible.set(false);
  }
}

export function findFollowUpQuestion(
  followUp: string,
  questions: readonly EvaluableInterviewQuestion[],
  currentQuestion?: EvaluableInterviewQuestion,
): EvaluableInterviewQuestion | undefined {
  const normalizedFollowUp = normalizeInterviewText(followUp);
  if (!normalizedFollowUp) return undefined;

  const candidates = questions.filter((question) => question.id !== currentQuestion?.id);
  const exact = candidates.find(
    (question) => normalizeInterviewText(question.question) === normalizedFollowUp,
  );
  return exact;
}
