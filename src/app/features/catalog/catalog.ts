import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson, RoadmapDefinition } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { CatalogSort } from './catalog.models';
import {
  applyCatalogFilters,
  buildLevelOptions,
  buildTechnologyOptions,
  deriveTechnologyFacets,
  groupCatalogLessons,
  normalizeCatalogLevel,
  normalizeCatalogSort,
  normalizeTechnologySelection,
  orderLessonsByCurriculum,
  sortCatalogLessons,
  totalDuration,
} from './catalog.utils';
import { CatalogFilterTabs } from './components/catalog-filter-tabs/catalog-filter-tabs';
import { CatalogSummary } from './components/catalog-summary/catalog-summary';
import { LessonGroup } from './components/lesson-group/lesson-group';

@Component({
  selector: 'app-catalog',
  imports: [CatalogFilterTabs, CatalogSummary, LessonGroup],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalog implements OnInit {
  private readonly repository = inject(ContentRepository);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly category = input.required<string>();
  readonly technology = input<string | undefined>('all');
  readonly level = input<string | undefined>('all');
  readonly sort = input<string | undefined>('route');

  protected readonly lessons = signal<Lesson[]>([]);
  protected readonly roadmaps = signal<RoadmapDefinition[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');

  protected readonly titles: Readonly<Record<string, string>> = {
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
  };

  protected readonly categoryLessons = computed(() =>
    this.lessons().filter((lesson) => lesson.category === this.category()),
  );
  protected readonly orderedLessons = computed(() =>
    orderLessonsByCurriculum(this.categoryLessons(), this.roadmaps()),
  );
  protected readonly curriculumIndex = computed(
    () => new Map(this.orderedLessons().map((lesson, index) => [lesson.id, index + 1])),
  );
  protected readonly technologyFacets = computed(() =>
    deriveTechnologyFacets(this.orderedLessons()),
  );
  protected readonly selectedLevel = computed(() => normalizeCatalogLevel(this.level()));
  protected readonly selectedTechnology = computed(() =>
    normalizeTechnologySelection(this.technology(), this.technologyFacets()),
  );
  protected readonly selectedSort = computed(() => normalizeCatalogSort(this.sort()));
  protected readonly levelOptions = computed(() =>
    buildLevelOptions(
      this.orderedLessons(),
      this.selectedTechnology(),
      this.technologyFacets(),
    ),
  );
  protected readonly technologyOptions = computed(() =>
    buildTechnologyOptions(
      this.orderedLessons(),
      this.selectedLevel(),
      this.technologyFacets(),
    ),
  );
  protected readonly visibleLessons = computed(() => {
    const filtered = applyCatalogFilters(
      this.orderedLessons(),
      this.selectedLevel(),
      this.selectedTechnology(),
      this.technologyFacets(),
    );
    return sortCatalogLessons(filtered, this.selectedSort(), this.curriculumIndex());
  });
  protected readonly groups = computed(() =>
    groupCatalogLessons(
      this.visibleLessons(),
      this.curriculumIndex(),
      this.technologyFacets(),
      this.selectedTechnology(),
      this.selectedSort(),
    ),
  );
  protected readonly visibleMinutes = computed(() => totalDuration(this.visibleLessons()));
  protected readonly hasActiveFilters = computed(
    () => this.selectedLevel() !== 'all' || this.selectedTechnology() !== 'all',
  );

  async ngOnInit(): Promise<void> {
    try {
      const [lessons, roadmaps] = await Promise.all([
        this.repository.lessons(),
        this.repository.roadmaps().catch(() => []),
      ]);
      this.lessons.set(lessons);
      this.roadmaps.set(roadmaps);
    } catch {
      this.loadError.set('Không thể tải kho bài học. Hãy chạy lại bước tạo content index.');
    } finally {
      this.loading.set(false);
    }
  }

  protected setLevel(value: string): void {
    this.navigateWithFilters(
      normalizeCatalogLevel(value),
      this.selectedTechnology(),
      this.selectedSort(),
    );
  }

  protected setTechnology(value: string): void {
    this.navigateWithFilters(
      this.selectedLevel(),
      normalizeTechnologySelection(value, this.technologyFacets()),
      this.selectedSort(),
    );
  }

  protected setSort(value: CatalogSort): void {
    this.navigateWithFilters(
      this.selectedLevel(),
      this.selectedTechnology(),
      normalizeCatalogSort(value),
    );
  }

  protected resetFilters(): void {
    this.navigateWithFilters('all', 'all', this.selectedSort());
  }

  private navigateWithFilters(level: string, technology: string, sort: CatalogSort): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        level: level === 'all' ? null : level,
        technology: technology === 'all' ? null : technology,
        sort: sort === 'route' ? null : sort,
      },
      queryParamsHandling: 'merge',
    });
  }
}
