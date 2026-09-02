import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAVIGATION } from '../../core/constants/navigation';
import { LearningStateService } from '../../core/services/learning-state.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({ selector: 'app-shell', imports: [RouterOutlet, RouterLink, RouterLinkActive], templateUrl: './app-shell.html', styleUrl: './app-shell.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class AppShell {
  protected readonly navigation = NAVIGATION;
  protected readonly menuOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly state = inject(LearningStateService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected submitSearch(event: SubmitEvent, query: string): void {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;
    this.searchOpen.set(false);
    void this.router.navigate(['/search'], { queryParams: { q: normalizedQuery } });
  }

  @HostListener('document:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); this.searchOpen.set(true); }
    else if (event.key === 'Escape') { this.searchOpen.set(false); this.menuOpen.set(false); }
  }
}
