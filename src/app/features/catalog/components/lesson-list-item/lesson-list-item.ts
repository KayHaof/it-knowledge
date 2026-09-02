import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../../../core/models/content.models';
import { ProgressStatus } from '../../../../core/models/learning-state.models';
import { LearningStateService } from '../../../../core/services/learning-state.service';
import { LEVEL_LABELS } from '../../catalog.utils';

const STATUS_DETAILS: Readonly<Record<ProgressStatus, { icon: string; label: string }>> = {
  'not-started': { icon: '○', label: 'Chưa học' },
  'in-progress': { icon: '◐', label: 'Đang học' },
  completed: { icon: '✓', label: 'Hoàn thành' },
  review: { icon: '↻', label: 'Cần ôn' },
};

@Component({
  selector: 'app-lesson-list-item',
  imports: [RouterLink],
  templateUrl: './lesson-list-item.html',
  styleUrl: './lesson-list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonListItem {
  protected readonly state = inject(LearningStateService);

  readonly lesson = input.required<Lesson>();
  readonly curriculumIndex = input.required<number>();

  protected readonly status = computed(() => this.state.status(this.lesson().id));
  protected readonly statusDetails = computed(() => STATUS_DETAILS[this.status()]);
  protected readonly levelLabel = computed(() => LEVEL_LABELS[this.lesson().level]);
  protected readonly sequence = computed(() => String(this.curriculumIndex()).padStart(2, '0'));
  protected readonly concepts = computed(() => this.lesson().tags.slice(0, 4).join(' • '));
  protected readonly incompletePrerequisites = computed(
    () =>
      this.lesson().prerequisites.filter(
        (prerequisiteId) => this.state.status(prerequisiteId) !== 'completed',
      ).length,
  );

  protected toggleBookmark(): void {
    this.state.toggleBookmark(this.lesson().id);
  }
}
