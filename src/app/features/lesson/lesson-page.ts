import { ChangeDetectionStrategy, Component, computed, effect, input, signal, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LEARNING_LEVEL_LABELS } from '../../core/constants/learning-levels';
import { Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';
import { LessonRenderer } from '../../shared/components/lesson-renderer/lesson-renderer';

@Component({ selector: 'app-lesson-page', imports: [RouterLink, LessonRenderer], templateUrl: './lesson-page.html', styleUrl: './lesson-page.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LessonPage {
  private readonly repository = inject(ContentRepository);
  protected readonly state = inject(LearningStateService);
  private readonly title = inject(Title);

  readonly slug = input.required<string>(); protected readonly lesson = signal<Lesson | undefined>(undefined); protected readonly allLessons = signal<Lesson[]>([]); protected readonly loading = signal(true); protected readonly related = computed(() => this.lesson()?.related.map((id) => this.allLessons().find((item) => item.id === id)).filter((item): item is Lesson => Boolean(item)) ?? []);
  protected readonly error = signal('');
  constructor() { effect(() => { void this.load(this.slug()); }); }
  private async load(slug: string): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const lessons = await this.repository.lessons();
      this.allLessons.set(lessons);
      const lesson = lessons.find((item) => item.slug === slug);
      this.lesson.set(lesson);
      if (lesson) {
        this.title.setTitle(`${lesson.title} — IT Knowledge`);
        this.state.addRecent(lesson.id);
        if (this.state.status(lesson.id) === 'not-started') {
          this.state.setProgress(lesson.id, 'in-progress');
        }
      }
    } catch {
      this.lesson.set(undefined);
      this.allLessons.set([]);
      this.error.set(
        this.repository.loadError() || 'Không thể tải bài học. Vui lòng thử tải lại trang.',
      );
    } finally {
      this.loading.set(false);
    }
  }
  protected previousLesson(): Lesson | undefined { const previous = this.lesson()?.previous; return previous ? this.allLessons().find((item) => item.id === previous) : undefined; }
  protected nextLesson(): Lesson | undefined { const next = this.lesson()?.next; return next ? this.allLessons().find((item) => item.id === next) : undefined; }
  protected levelLabel(): string { const level=this.lesson()?.level; return level ? LEARNING_LEVEL_LABELS[level] : ''; }
}
