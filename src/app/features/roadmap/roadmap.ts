import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEARNING_LEVEL_LABELS } from '../../core/constants/learning-levels';
import { Lesson, RoadmapDefinition } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';

@Component({ selector:'app-roadmap',imports:[RouterLink],templateUrl:'./roadmap.html',styleUrl:'./roadmap.scss',changeDetection:ChangeDetectionStrategy.OnPush })
export class Roadmap implements OnInit {
 private readonly repository = inject(ContentRepository);
 protected readonly state = inject(LearningStateService);
 readonly id=input('backend');protected readonly roadmaps=signal<RoadmapDefinition[]>([]);protected readonly lessons=signal<Lesson[]>([]);protected readonly loading=signal(true);protected readonly error=signal('');protected readonly selected=computed<RoadmapDefinition|undefined>(()=>this.roadmaps().find((item)=>item.id===this.id())??this.roadmaps()[0]);async ngOnInit():Promise<void>{try{const [roadmaps,lessons]=await Promise.all([this.repository.roadmaps(),this.repository.lessons()]);this.roadmaps.set(roadmaps);this.lessons.set(lessons);}catch{this.error.set(this.repository.loadError()||'Không thể tải roadmap. Vui lòng thử tải lại trang.');}finally{this.loading.set(false);}}protected lesson(id:string):Lesson|undefined{return this.lessons().find((item)=>item.id===id);}protected levelLabel(lesson:Lesson):string{return LEARNING_LEVEL_LABELS[lesson.level];}protected percent():number{const steps=this.selected()?.steps??[];return steps.length?Math.round(steps.filter((step)=>this.state.status(step.lessonId)==='completed').length/steps.length*100):0;}}
