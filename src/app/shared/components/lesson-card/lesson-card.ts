import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEARNING_LEVEL_LABELS } from '../../../core/constants/learning-levels';
import { Lesson } from '../../../core/models/content.models';
import { LearningStateService } from '../../../core/services/learning-state.service';

@Component({ selector: 'app-lesson-card', imports: [RouterLink], templateUrl: './lesson-card.html', styleUrl: './lesson-card.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LessonCard {
 protected readonly state = inject(LearningStateService);
 readonly lesson = input.required<Lesson>();
 protected readonly levelLabel = computed(() => LEARNING_LEVEL_LABELS[this.lesson().level]); }
