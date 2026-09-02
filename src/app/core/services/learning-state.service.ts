import { computed, Injectable, signal, inject } from '@angular/core';
import { LearningData, ProgressStatus, ThemePreference } from '../models/learning-state.models';
import { StorageService } from '../storage/storage.service';

const STORAGE_KEY = 'it-learning-platform:v1:data';
const emptyData = (): LearningData => ({
  version: 1, progress: {}, bookmarks: [], recent: [], masteredQuestions: [], reviewQuestions: [], settings: { theme: 'system' },
});

@Injectable({ providedIn: 'root' })
export class LearningStateService {
  private readonly storage = inject(StorageService);

  private readonly state = signal(this.storage.read<LearningData>(STORAGE_KEY, emptyData()));
  readonly data = this.state.asReadonly();
  readonly completedCount = computed(() => Object.values(this.state().progress).filter((value) => value === 'completed').length);
  status(id: string): ProgressStatus { return this.state().progress[id] ?? 'not-started'; }
  isBookmarked(id: string): boolean { return this.state().bookmarks.includes(id); }
  isMastered(id: string): boolean { return this.state().masteredQuestions.includes(id); }
  isForReview(id: string): boolean { return this.state().reviewQuestions.includes(id); }
  setProgress(id: string, status: ProgressStatus): void { this.update((data) => ({ ...data, progress: { ...data.progress, [id]: status } })); }
  toggleBookmark(id: string): void { this.update((data) => ({ ...data, bookmarks: toggle(data.bookmarks, id) })); }
  addRecent(id: string): void { this.update((data) => ({ ...data, recent: [id, ...data.recent.filter((item) => item !== id)].slice(0, 15) })); }
  setTheme(theme: ThemePreference): void { this.update((data) => ({ ...data, settings: { ...data.settings, theme } })); }
  toggleQuestion(id: string, target: 'masteredQuestions' | 'reviewQuestions'): void { this.update((data) => ({ ...data, [target]: toggle(data[target], id) })); }
  exportData(): string { return JSON.stringify(this.state(), null, 2); }
  importData(raw: string): boolean {
    try {
      const parsed = JSON.parse(raw) as Partial<LearningData>;
      if (parsed.version !== 1 || !parsed.progress || !parsed.settings) return false;
      this.state.set({ ...emptyData(), ...parsed } as LearningData); this.persist(); return true;
    } catch { return false; }
  }
  reset(kind: 'progress' | 'bookmarks' | 'all'): void {
    if (kind === 'all') this.state.set(emptyData());
    else if (kind === 'progress') this.update((data) => ({ ...data, progress: {} }));
    else this.update((data) => ({ ...data, bookmarks: [] }));
    this.persist();
  }
  private update(updater: (data: LearningData) => LearningData): void { this.state.update(updater); this.persist(); }
  private persist(): void { this.storage.write(STORAGE_KEY, this.state()); }
}
function toggle(values: string[], id: string): string[] { return values.includes(id) ? values.filter((value) => value !== id) : [...values, id]; }
