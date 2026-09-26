import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  ContentManifest,
  ContentStats,
  Flashcard,
  InterviewQuestion,
  Lesson,
  RoadmapDefinition,
  SearchDocument,
} from '../models/content.models';
import { AssetUrlService } from './asset-url.service';

@Injectable({ providedIn: 'root' })
export class ContentRepository {
  private readonly http = inject(HttpClient);
  private readonly assets = inject(AssetUrlService);

  private lessonsPromise?: Promise<Lesson[]>;
  private interviewPromise?: Promise<InterviewQuestion[]>;
  private roadmapPromise?: Promise<RoadmapDefinition[]>;
  private flashcardsPromise?: Promise<Flashcard[]>;
  private manifestPromise?: Promise<ContentManifest>;
  private statsPromise?: Promise<ContentStats>;
  private searchPromise?: Promise<SearchDocument[]>;
  readonly loadError = signal('');

  lessons(): Promise<Lesson[]> {
    this.lessonsPromise ??= this.load<Lesson[]>('generated/lessons.json');
    return this.lessonsPromise;
  }
  async lessonBySlug(slug: string): Promise<Lesson | undefined> {
    return (await this.lessons()).find((lesson) => lesson.slug === slug);
  }
  interviewQuestions(): Promise<InterviewQuestion[]> {
    this.interviewPromise ??= this.load<InterviewQuestion[]>('generated/interview.json');
    return this.interviewPromise;
  }
  roadmaps(): Promise<RoadmapDefinition[]> {
    this.roadmapPromise ??= this.load<RoadmapDefinition[]>('generated/roadmaps.json');
    return this.roadmapPromise;
  }
  flashcards(): Promise<Flashcard[]> {
    this.flashcardsPromise ??= this.load<Flashcard[]>('generated/flashcards.json');
    return this.flashcardsPromise;
  }
  manifest(): Promise<ContentManifest> {
    this.manifestPromise ??= this.load<ContentManifest>('generated/manifest.json');
    return this.manifestPromise;
  }
  stats(): Promise<ContentStats> {
    this.statsPromise ??= this.load<ContentStats>('generated/content-stats.json');
    return this.statsPromise;
  }
  searchIndex(): Promise<SearchDocument[]> {
    this.searchPromise ??= this.load<SearchDocument[]>('generated/search-index.json');
    return this.searchPromise;
  }

  private async load<T>(url: string): Promise<T> {
    try { return await firstValueFrom(this.http.get<T>(this.assets.resolve(url))); }
    catch (error) {
      this.loadError.set('Không thể tải dữ liệu học tập. Vui lòng thử tải lại trang.');
      throw error;
    }
  }
}
