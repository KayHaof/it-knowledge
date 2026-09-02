import { ChangeDetectionStrategy, Component, computed, effect, input, signal, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
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
  constructor() { effect(() => { void this.load(this.slug()); }); }
  private async load(slug: string): Promise<void> { this.loading.set(true); const lessons = await this.repository.lessons(); this.allLessons.set(lessons); const lesson = lessons.find((item) => item.slug === slug); this.lesson.set(lesson); this.loading.set(false); if (lesson) { this.title.setTitle(`${lesson.title} — IT Knowledge`); this.state.addRecent(lesson.id); if (this.state.status(lesson.id) === 'not-started') this.state.setProgress(lesson.id, 'in-progress'); } }
  protected nextLesson(): Lesson | undefined { const next = this.lesson()?.next; return next ? this.allLessons().find((item) => item.id === next) : undefined; }
}
