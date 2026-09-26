import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ContentStats, Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';
import { LessonCard } from '../../shared/components/lesson-card/lesson-card';

interface DomainSummary {
  category: string;
  title: string;
  path: string;
  technologies: string;
  count: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend Engineering',
  mobile: 'Mobile Engineering',
  backend: 'Java & Spring Backend',
  database: 'Database Engineering',
  nosql: 'NoSQL & Caching',
  messaging: 'Messaging & Real-time',
  architecture: 'Software Architecture',
  'distributed-systems': 'Distributed Systems',
  security: 'Application Security',
  performance: 'High Performance Systems',
  devops: 'DevOps & Cloud',
  testing: 'Testing & Quality',
  'system-design': 'System Design',
};

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, LessonCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly repository = inject(ContentRepository);
  private readonly router = inject(Router);
  protected readonly state = inject(LearningStateService);

  protected query = '';
  protected readonly lessons = signal<Lesson[]>([]);
  protected readonly stats = signal<ContentStats | undefined>(undefined);
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly domains = computed<DomainSummary[]>(() => {
    const groups = new Map<string, Lesson[]>();
    for (const lesson of this.lessons()) {
      const group = groups.get(lesson.category) ?? [];
      group.push(lesson);
      groups.set(lesson.category, group);
    }
    return [...groups.entries()]
      .map(([category, lessons]) => ({
        category,
        title: CATEGORY_LABELS[category] ?? category,
        path: category === 'system-design' ? '/system-design' : `/learn/${category}`,
        technologies: [...new Set(lessons.flatMap((lesson) => splitTechnology(lesson.technology)))]
          .slice(0, 4)
          .join(', '),
        count: lessons.length,
      }))
      .sort((left, right) => right.count - left.count || left.title.localeCompare(right.title, 'vi'));
  });

  async ngOnInit(): Promise<void> {
    try {
      const [lessons, stats] = await Promise.all([
        this.repository.lessons(),
        this.repository.stats().catch(() => undefined),
      ]);
      this.lessons.set(lessons);
      this.stats.set(stats);
    } catch {
      this.loadError.set('Không thể tải dữ liệu học tập. Vui lòng thử lại.');
    } finally {
      this.loading.set(false);
    }
  }

  protected search(): void {
    const q = this.query.trim();
    if (q) void this.router.navigate(['/search'], { queryParams: { q } });
  }

  protected byIds(ids: string[]): Lesson[] {
    return ids
      .map((id) => this.lessons().find((lesson) => lesson.id === id))
      .filter((lesson): lesson is Lesson => Boolean(lesson));
  }

  protected nextLessons(): Lesson[] {
    const levelRank = { basic: 0, advanced: 1, extended: 2 } as const;
    return this.lessons()
      .filter((lesson) => this.state.status(lesson.id) !== 'completed')
      .sort(
        (left, right) =>
          levelRank[left.level] - levelRank[right.level] ||
          left.order - right.order ||
          left.title.localeCompare(right.title, 'vi'),
      )
      .slice(0, 3);
  }

  protected lessonCount(): number {
    return this.stats()?.totalLessons ?? this.lessons().length;
  }

  protected domainCount(): number {
    return this.domains().length;
  }
}

function splitTechnology(value: string): string[] {
  return value
    .split(/\s+\/\s+|,\s*|\s+(?:and|và)\s+/giu)
    .map((part) => part.trim())
    .filter(Boolean);
}
