import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ContentType, LearningLevel } from '../../core/models/content.models';
import {
  RankedSearchResult,
  SearchFacets,
  SearchFilters,
  SearchService,
} from '../../core/services/search.service';

const EMPTY_FACETS: SearchFacets = { technologies: [], levels: [], contentTypes: [] };
const LEVEL_LABELS: Record<LearningLevel, string> = {
  basic: 'Cơ bản',
  advanced: 'Nâng cao',
  extended: 'Mở rộng',
};

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);

  readonly q = input<string | undefined>('');
  readonly technology = input<string | undefined>('all');
  readonly level = input<string | undefined>('all');
  readonly contentType = input<string | undefined>('all');

  protected query = '';
  protected selectedTechnology = 'all';
  protected selectedLevel: LearningLevel | 'all' = 'all';
  protected selectedContentType: ContentType | 'all' = 'all';
  protected readonly levelLabels = LEVEL_LABELS;
  protected readonly facets = signal<SearchFacets>(EMPTY_FACETS);
  protected readonly results = signal<RankedSearchResult[]>([]);
  protected readonly searching = signal(false);
  protected readonly error = signal('');

  constructor() {
    void this.loadFacets();
    effect(() => {
      this.query = this.q() ?? '';
      this.selectedTechnology = this.technology() || 'all';
      this.selectedLevel = normalizeLevel(this.level());
      this.selectedContentType = normalizeContentType(this.contentType());
      void this.run();
    });
  }

  protected submit(): void {
    void this.router.navigate(['/search'], {
      queryParams: {
        q: this.query || null,
        technology: this.selectedTechnology === 'all' ? null : this.selectedTechnology,
        level: this.selectedLevel === 'all' ? null : this.selectedLevel,
        contentType: this.selectedContentType === 'all' ? null : this.selectedContentType,
      },
    });
  }

  protected hasCriteria(): boolean {
    return Boolean(
      this.query.trim() ||
      this.selectedTechnology !== 'all' ||
      this.selectedLevel !== 'all' ||
      this.selectedContentType !== 'all',
    );
  }

  private async loadFacets(): Promise<void> {
    try {
      this.facets.set(await this.searchService.facets());
    } catch {
      this.error.set('Không thể tải dữ liệu tìm kiếm. Vui lòng thử lại.');
    }
  }

  private async run(): Promise<void> {
    this.searching.set(true);
    this.error.set('');
    const filters: SearchFilters = {
      technology: this.selectedTechnology,
      level: this.selectedLevel,
      contentType: this.selectedContentType,
    };
    try {
      this.results.set(await this.searchService.search(this.query, filters));
    } catch {
      this.results.set([]);
      this.error.set('Không thể tải dữ liệu tìm kiếm. Vui lòng thử lại.');
    } finally {
      this.searching.set(false);
    }
  }
}

function normalizeLevel(value: string | undefined): LearningLevel | 'all' {
  return value === 'basic' || value === 'advanced' || value === 'extended' ? value : 'all';
}

function normalizeContentType(value: string | undefined): ContentType | 'all' {
  const allowed: ContentType[] = [
    'core',
    'internals',
    'production',
    'troubleshooting',
    'performance',
    'security',
    'architecture',
    'system-design',
    'integration',
    'comparison',
    'reference',
    'interview',
    'supplementary',
  ];
  return allowed.includes(value as ContentType) ? (value as ContentType) : 'all';
}
