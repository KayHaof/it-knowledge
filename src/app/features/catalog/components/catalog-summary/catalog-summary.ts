import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CatalogSort } from '../../catalog.models';
import { SORT_OPTIONS, formatDuration } from '../../catalog.utils';

@Component({
  selector: 'app-catalog-summary',
  templateUrl: './catalog-summary.html',
  styleUrl: './catalog-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogSummary {
  readonly lessonCount = input.required<number>();
  readonly totalMinutes = input.required<number>();
  readonly sort = input.required<CatalogSort>();
  readonly sortChange = output<CatalogSort>();

  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly formatDuration = formatDuration;

  protected changeSort(event: Event): void {
    this.sortChange.emit((event.target as HTMLSelectElement).value as CatalogSort);
  }
}
