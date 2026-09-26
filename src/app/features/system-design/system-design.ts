import { ChangeDetectionStrategy, Component, computed, OnInit, signal, inject } from '@angular/core';
import { Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LessonCard } from '../../shared/components/lesson-card/lesson-card';
@Component({selector:'app-system-design',imports:[LessonCard],templateUrl:'./system-design.html',styleUrl:'./system-design.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class SystemDesign implements OnInit {
private readonly repository = inject(ContentRepository);
private readonly lessons=signal<Lesson[]>([]);protected readonly loading=signal(true);protected readonly error=signal('');protected readonly cases=computed(()=>this.lessons().filter((item)=>item.category==='system-design').sort((left,right)=>left.order-right.order));protected readonly introduction=computed<Lesson|undefined>(()=>this.cases().at(0));async ngOnInit():Promise<void>{try{this.lessons.set(await this.repository.lessons());}catch{this.error.set(this.repository.loadError()||'Không thể tải nội dung System Design. Vui lòng thử tải lại trang.');}finally{this.loading.set(false);}}}
