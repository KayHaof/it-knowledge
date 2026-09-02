import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CatalogLessonGroup } from '../../catalog.models';
import { LessonListItem } from '../lesson-list-item/lesson-list-item';

@Component({
  selector: 'app-lesson-group',
  imports: [LessonListItem],
  templateUrl: './lesson-group.html',
  styleUrl: './lesson-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonGroup {
  readonly group = input.required<CatalogLessonGroup>();
  protected readonly headingId = computed(() => 'lesson-group-' + this.group().key);
}
