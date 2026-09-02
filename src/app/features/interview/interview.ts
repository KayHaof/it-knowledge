import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InterviewQuestion } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';

@Component({selector:'app-interview',imports:[RouterLink],templateUrl:'./interview.html',styleUrl:'./interview.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class Interview implements OnInit {
private readonly repository = inject(ContentRepository);
protected readonly state = inject(LearningStateService);
 readonly category=input('all');protected readonly questions=signal<InterviewQuestion[]>([]);protected readonly difficulty=signal('all');protected readonly index=signal(0);protected readonly answerVisible=signal(false);protected readonly filtered=computed(()=>this.questions().filter((q)=>(this.category()==='all'||q.category.toLowerCase()===this.category().toLowerCase())&&(this.difficulty()==='all'||q.difficulty===this.difficulty())));protected readonly current=computed(()=>this.filtered()[Math.min(this.index(),Math.max(0,this.filtered().length-1))]);async ngOnInit():Promise<void>{this.questions.set(await this.repository.interviewQuestions());}protected setDifficulty(event:Event):void{this.difficulty.set((event.target as HTMLSelectElement).value);this.index.set(0);}protected move(delta:number):void{const total=this.filtered().length;if(!total)return;this.index.set((this.index()+delta+total)%total);this.answerVisible.set(false);}protected random():void{const total=this.filtered().length;if(total)this.index.set(Math.floor(Math.random()*total));this.answerVisible.set(false);}}
