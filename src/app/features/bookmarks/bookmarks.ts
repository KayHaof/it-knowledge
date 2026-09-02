import { ChangeDetectionStrategy, Component, computed, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';
import { LessonCard } from '../../shared/components/lesson-card/lesson-card';
@Component({selector:'app-bookmarks',imports:[LessonCard,RouterLink],templateUrl:'./bookmarks.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class Bookmarks implements OnInit {
private readonly repository = inject(ContentRepository);
protected readonly state = inject(LearningStateService);
private readonly lessons=signal<Lesson[]>([]);protected readonly saved=computed(()=>this.lessons().filter((item)=>this.state.data().bookmarks.includes(item.id)));async ngOnInit():Promise<void>{this.lessons.set(await this.repository.lessons());}}
