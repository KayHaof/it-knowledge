import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEARNING_LEVEL_LABELS } from '../../core/constants/learning-levels';
import {
  buildCategoryOptions,
  buildLevelOptions,
  buildModeOptions,
  buildTechnologyOptions,
  filterFlashcards,
} from '../../core/flashcards/flashcard-filtering';
import {
  Flashcard,
  FlashcardLevel,
  FlashcardRating,
  FlashcardStudyMode,
} from '../../core/flashcards/flashcard.models';
import { FlashcardStateService } from '../../core/flashcards/flashcard-state.service';
import { ContentRepository } from '../../core/services/content-repository';

interface LessonReference {
  id: string;
  path: string;
  title: string;
}

interface FlashcardRepository {
  flashcards(): Promise<Flashcard[]>;
  lessons(): Promise<LessonReference[]>;
  loadError?: () => string;
}

const RATING_LABELS: Readonly<Record<FlashcardRating, string>> = {
  again: 'Lại',
  hard: 'Khó',
  good: 'Tốt',
  easy: 'Dễ',
};

@Component({
  selector: 'app-flashcards',
  imports: [RouterLink],
  templateUrl: './flashcards.html',
  styleUrl: './flashcards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flashcards implements OnInit {
  private readonly repository = inject(ContentRepository) as unknown as FlashcardRepository;
  protected readonly state = inject(FlashcardStateService);

  protected readonly cards = signal<Flashcard[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly technology = signal('all');
  protected readonly level = signal<FlashcardLevel | 'all'>('all');
  protected readonly category = signal('all');
  protected readonly mode = signal<FlashcardStudyMode>('all');
  protected readonly index = signal(0);
  protected readonly flipped = signal(false);
  protected readonly reviewMessage = signal('');
  private readonly now = signal(this.state.currentTime());
  private readonly lessonReferences = signal(new Map<string, LessonReference>());

  protected readonly technologyOptions = computed(() => buildTechnologyOptions(this.cards()));
  protected readonly levelOptions = computed(() => buildLevelOptions(this.cards()));
  protected readonly categoryOptions = computed(() => buildCategoryOptions(this.cards()));
  protected readonly modeOptions = computed(() =>
    buildModeOptions(this.metadataFiltered(), this.state.data().cards, this.now()),
  );
  protected readonly filtered = computed(() =>
    filterFlashcards(
      this.cards(),
      {
        technology: this.technology(),
        level: this.level(),
        category: this.category(),
        mode: this.mode(),
      },
      this.state.data().cards,
      this.now(),
    ),
  );
  protected readonly currentIndex = computed(() =>
    Math.min(this.index(), Math.max(0, this.filtered().length - 1)),
  );
  protected readonly current = computed(() => this.filtered()[this.currentIndex()]);

  constructor() {
    effect(() => {
      this.technology();
      this.level();
      this.category();
      this.mode();
      this.index.set(0);
      this.flipped.set(false);
      this.reviewMessage.set('');
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const cards = await this.repository.flashcards();
      this.cards.set(cards);
      if (cards.some((card) => !card.sourcePath && card.sourceLesson)) {
        void this.loadLessonReferences();
      }
    } catch {
      this.error.set(
        this.repository.loadError?.() || 'Không thể tải dữ liệu flashcard. Vui lòng thử lại sau.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  protected setTechnology(event: Event): void {
    this.technology.set(selectValue(event));
  }

  protected setLevel(event: Event): void {
    const value = selectValue(event);
    this.level.set(
      value === 'basic' || value === 'advanced' || value === 'extended' ? value : 'all',
    );
  }

  protected setCategory(event: Event): void {
    this.category.set(selectValue(event));
  }

  protected setMode(mode: FlashcardStudyMode): void {
    this.mode.set(mode);
  }

  protected toggleFlip(): void {
    if (this.current()) this.flipped.update((value) => !value);
  }

  protected move(delta: number): void {
    const total = this.filtered().length;
    if (!total) return;
    this.index.set((this.currentIndex() + delta + total) % total);
    this.flipped.set(false);
    this.reviewMessage.set('');
  }

  protected shuffle(): void {
    const total = this.filtered().length;
    if (total < 2) return;
    const offset = 1 + Math.floor(Math.random() * (total - 1));
    this.index.set((this.currentIndex() + offset) % total);
    this.flipped.set(false);
    this.reviewMessage.set('');
  }

  protected toggleBookmark(card: Flashcard): void {
    this.state.toggleBookmark(card.id);
  }

  protected rate(card: Flashcard, rating: FlashcardRating): void {
    if (!this.flipped()) return;
    const result = this.state.review(card.id, rating);
    this.now.set(this.state.currentTime());
    this.reviewMessage.set(
      `Đã ghi nhận ${RATING_LABELS[rating]}. Ôn lại gợi ý: ${formatDate(result.nextSuggestedReview)}.`,
    );
  }

  protected sourcePath(card: Flashcard): string | undefined {
    if (card.sourcePath) return card.sourcePath;
    if (card.sourceLesson?.startsWith('/')) return card.sourceLesson;
    return this.lessonReferences().get(sourceLessonId(card))?.path;
  }

  protected sourceTitle(card: Flashcard): string {
    return (
      card.sourceLessonTitle ||
      this.lessonReferences().get(sourceLessonId(card))?.title ||
      'Mở bài học nguồn'
    );
  }

  protected levelLabel(level: FlashcardLevel): string {
    return LEARNING_LEVEL_LABELS[level];
  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeyboard(event: KeyboardEvent): void {
    if (event.repeat || isInteractive(event.target)) return;
    if (event.key === 'ArrowLeft') this.move(-1);
    else if (event.key === 'ArrowRight') this.move(1);
    else if (event.key === ' ' || event.key.toLowerCase() === 'f') this.toggleFlip();
    else return;
    event.preventDefault();
  }

  private metadataFiltered(): Flashcard[] {
    return filterFlashcards(
      this.cards(),
      {
        technology: this.technology(),
        level: this.level(),
        category: this.category(),
        mode: 'all',
      },
      this.state.data().cards,
      this.now(),
    );
  }

  private async loadLessonReferences(): Promise<void> {
    try {
      const lessons = await this.repository.lessons();
      this.lessonReferences.set(new Map(lessons.map((lesson) => [lesson.id, lesson])));
    } catch {
      // Flashcards remain usable when optional lesson-link enrichment cannot load.
    }
  }
}

function sourceLessonId(card: Flashcard): string {
  return card.sourceLessonId || card.sourceLesson || '';
}

function selectValue(event: Event): string {
  return event.target instanceof HTMLSelectElement ? event.target.value : 'all';
}

function isInteractive(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('button, a, input, select, textarea, [contenteditable="true"]'))
  );
}

function formatDate(value: string | null): string {
  if (!value) return 'chưa xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
