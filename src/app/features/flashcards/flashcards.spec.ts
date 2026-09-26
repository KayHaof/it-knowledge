import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Flashcard } from '../../core/flashcards/flashcard.models';
import {
  FLASHCARD_CLOCK,
  FlashcardStateService,
} from '../../core/flashcards/flashcard-state.service';
import { ContentRepository } from '../../core/services/content-repository';
import { Flashcards } from './flashcards';

const NOW = new Date('2026-09-26T08:00:00.000Z');

describe('Flashcards', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Flashcards],
      providers: [
        provideRouter([]),
        { provide: FLASHCARD_CLOCK, useValue: () => new Date(NOW) },
        {
          provide: ContentRepository,
          useValue: {
            flashcards: () => Promise.resolve(cards()),
            lessons: () =>
              Promise.resolve([
                { id: 'java-foundation', path: '/learn/backend/java-foundation', title: 'Java Foundation' },
              ]),
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('uses metadata-derived filters and composes the selected dimensions', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const selects = root.querySelectorAll<HTMLSelectElement>('.metadata-filters select');
    expect(selects).toHaveLength(3);

    setSelect(selects[0], 'spring');
    fixture.detectChanges();
    setSelect(selects[1], 'advanced');
    fixture.detectChanges();

    expect(root.querySelector('.card-copy')?.textContent).toContain(
      'Spring transaction hoạt động thế nào?',
    );
    expect(root.textContent).toContain('1 / 1 thẻ');
  });

  it('flips with a click and supports Arrow/F keyboard navigation', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const surface = root.querySelector<HTMLButtonElement>('.flashcard-surface');

    expect(surface?.getAttribute('aria-pressed')).toBe('false');
    surface?.click();
    fixture.detectChanges();
    expect(surface?.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.card-copy')?.textContent).toContain(
      'Máy ảo thực thi bytecode',
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    fixture.detectChanges();
    expect(root.querySelector('.card-copy')?.textContent).toContain(
      'HashMap collision là gì?',
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', cancelable: true }));
    fixture.detectChanges();
    expect(root.querySelector('.card-copy')?.textContent).toContain(
      'nhiều key vào cùng bucket',
    );
  });

  it('persists ratings only after the answer is revealed', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const rating = root.querySelector<HTMLButtonElement>('[data-rating="good"]');
    expect(rating?.disabled).toBe(true);

    root.querySelector<HTMLButtonElement>('.flashcard-surface')?.click();
    fixture.detectChanges();
    expect(rating?.disabled).toBe(false);
    rating?.click();
    fixture.detectChanges();

    expect(TestBed.inject(FlashcardStateService).reviewState('java-jvm')).toMatchObject({
      reviewCount: 1,
      lastRating: 'good',
      nextSuggestedReview: '2026-09-29T08:00:00.000Z',
    });
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Đã ghi nhận Tốt',
    );
  });

  it('shows source traceability and manual/generated origin', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const source = root.querySelector<HTMLAnchorElement>('.source-link');
    expect(source?.textContent).toContain('Java Foundation');
    expect(source?.getAttribute('href')).toBe('/learn/backend/java-foundation');
    expect(root.querySelector('.origin')?.textContent).toContain('Thẻ biên soạn');
    expect(root.querySelector('.badge')?.textContent).toContain('Cơ bản');
  });

  it('stores bookmark state from the current card', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const bookmark = root.querySelector<HTMLButtonElement>('.bookmark');

    expect(bookmark?.getAttribute('aria-pressed')).toBe('false');
    bookmark?.click();
    fixture.detectChanges();

    expect(bookmark?.getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(FlashcardStateService).isBookmarked('java-jvm')).toBe(true);
  });
});

async function createFixture() {
  const fixture = TestBed.createComponent(Flashcards);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

function setSelect(select: HTMLSelectElement | undefined, value: string): void {
  if (!select) throw new Error('Expected metadata filter select');
  select.value = value;
  select.dispatchEvent(new Event('change'));
}

function cards(): Flashcard[] {
  return [
    {
      id: 'java-jvm',
      technology: 'Java',
      category: 'Core',
      level: 'basic',
      front: 'JVM là gì?',
      back: 'Máy ảo thực thi bytecode.',
      tags: ['jvm'],
      generated: false,
      sourceLesson: 'java-foundation',
      sourcePath: '/learn/backend/java-foundation',
      sourceLessonTitle: 'Java Foundation',
    },
    {
      id: 'java-map',
      technology: 'Java',
      category: 'Collections',
      level: 'advanced',
      front: 'HashMap collision là gì?',
      back: 'Collision xảy ra khi nhiều key vào cùng bucket.',
      tags: ['hashmap'],
      generated: true,
      sourceLesson: '',
      sourcePath: '',
    },
    {
      id: 'spring-tx',
      technology: 'Spring',
      category: 'Transactions',
      level: 'advanced',
      front: 'Spring transaction hoạt động thế nào?',
      back: 'Proxy áp dụng transaction interceptor.',
      tags: ['spring'],
      generated: false,
      sourceLesson: '',
      sourcePath: '',
    },
  ];
}
