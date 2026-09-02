import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';
import { LessonCard } from '../../shared/components/lesson-card/lesson-card';

@Component({ selector: 'app-dashboard', imports: [RouterLink, LessonCard], templateUrl: './dashboard.html', styleUrl: './dashboard.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class Dashboard implements OnInit {
  private readonly repository = inject(ContentRepository);
  protected readonly state = inject(LearningStateService);

  protected readonly lessons = signal<Lesson[]>([]); protected readonly loading = signal(true);
  async ngOnInit(): Promise<void> { this.lessons.set(await this.repository.lessons()); this.loading.set(false); }
  protected byIds(ids: string[]): Lesson[] { return ids.map((id) => this.lessons().find((lesson) => lesson.id === id)).filter((lesson): lesson is Lesson => Boolean(lesson)); }
  protected nextLessons(): Lesson[] {
    const priority = ['java-jvm-memory','java-concurrency','spring-mvc-webflux','relational-database','database-query-plan','jpa-n-plus-one'];
    return priority
      .map((id) => this.lessons().find((lesson) => lesson.id === id))
      .filter((lesson): lesson is Lesson => Boolean(lesson))
      .filter((lesson) => this.state.status(lesson.id) !== 'completed')
      .slice(0, 3);
  }
}
