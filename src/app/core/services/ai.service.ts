import { Injectable, InjectionToken, inject } from '@angular/core';

export interface AiContext { lessonTitle: string; lessonContent: string; sourceUrls: string[] }
export interface AiRequest { action: 'explain-simpler' | 'example' | 'interview' | 'quiz' | 'compare' | 'ask'; prompt: string; context: AiContext }
export interface AiProvider { readonly name: string; ask(request: AiRequest): Promise<string> }

export const AI_PROVIDER = new InjectionToken<AiProvider>('AI_PROVIDER', {
  providedIn: 'root',
  factory: () => ({ name: 'disabled', ask: async () => 'AI đang tắt. Nội dung local và các nguồn chính thức vẫn hoạt động đầy đủ.' }),
});

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly provider = inject(AI_PROVIDER);
  readonly enabled = this.provider.name !== 'disabled';
  ask(request: AiRequest): Promise<string> { return this.provider.ask(request); }
}
