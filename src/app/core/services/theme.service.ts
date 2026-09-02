import { DOCUMENT } from '@angular/common';
import { effect, Injectable, inject, OnDestroy, signal } from '@angular/core';
import { LearningStateService } from './learning-state.service';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly media = matchMedia('(prefers-color-scheme: dark)');
  private readonly systemDark = signal(this.media.matches);
  private readonly onSystemTheme = (event: MediaQueryListEvent): void => this.systemDark.set(event.matches);
  constructor() {
    const document = inject<Document>(DOCUMENT);
    const state = inject(LearningStateService);

    effect(() => {
      const preference = state.data().settings.theme;
      const resolved = preference === 'system' ? (this.systemDark() ? 'dark' : 'light') : preference;
      document.documentElement.dataset['theme'] = resolved;
      document.documentElement.style.colorScheme = resolved;
    });
    this.media.addEventListener('change', this.onSystemTheme);
  }
  ngOnDestroy(): void { this.media.removeEventListener('change', this.onSystemTheme); }
}
