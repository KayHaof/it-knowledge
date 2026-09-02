import { ChangeDetectionStrategy, Component, computed, OnInit, signal, inject } from '@angular/core';
import { Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LessonCard } from '../../shared/components/lesson-card/lesson-card';
@Component({selector:'app-system-design',imports:[LessonCard],templateUrl:'./system-design.html',styleUrl:'./system-design.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class SystemDesign implements OnInit {
private readonly repository = inject(ContentRepository);
private readonly lessons=signal<Lesson[]>([]);protected readonly cases=computed(()=>this.lessons().filter((item)=>item.category==='system-design'));async ngOnInit():Promise<void>{this.lessons.set(await this.repository.lessons());}}
