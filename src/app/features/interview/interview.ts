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
import { InterviewQuestion } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';

interface InterviewFilterOption { value: string; label: string; count: number }

const DIFFICULTIES: readonly InterviewFilterOption[] = [
  { value: 'junior', label: 'Junior', count: 0 },
  { value: 'middle', label: 'Middle', count: 0 },
  { value: 'senior', label: 'Senior', count: 0 },
  { value: 'system-design', label: 'System Design', count: 0 },
  { value: 'beginner', label: 'Beginner', count: 0 },
];

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
  protected readonly state = inject(LearningStateService);

  readonly category = input('all');
  readonly difficulty = input('all');
  protected readonly questions = signal<InterviewQuestion[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly index = signal(0);
  protected readonly answerVisible = signal(false);

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
      this.index.set(0);
      this.answerVisible.set(false);
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.questions.set(await this.repository.interviewQuestions());
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
    this.answerVisible.set(false);
  }

  protected random(): void {
    const total = this.filtered().length;
    if (total) this.index.set(Math.floor(Math.random() * total));
    this.answerVisible.set(false);
  }

  private navigateFilters(category: string, difficulty: string): void {
    void this.router.navigate(['/interview'], {
      queryParams: {
        category: category === 'all' ? null : category,
        difficulty: difficulty === 'all' ? null : difficulty,
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
}
