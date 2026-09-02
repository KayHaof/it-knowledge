import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { InterviewQuestion } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { Interview } from './interview';

describe('Interview', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Interview],
      providers: [
        provideRouter([{ path: 'interview', component: Interview }], withComponentInputBinding()),
        {
          provide: ContentRepository,
          useValue: { interviewQuestions: () => Promise.resolve(sampleQuestions()) },
        },
      ],
    }).compileComponents();
  });

  it('composes category and difficulty query filters using actual question data', async () => {
    const harness = await RouterTestingHarness.create('/interview?category=java&difficulty=senior');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain('JVM memory');
    expect(harness.routeNativeElement?.textContent).toContain('1 / 1');
    expect(findButton(harness.routeNativeElement, 'Java')?.textContent).toContain('1');
    expect(findButton(harness.routeNativeElement, 'Senior')?.getAttribute('aria-pressed')).toBe('true');

    findButton(harness.routeNativeElement, 'Spring')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const router = TestBed.inject(Router);
    expect(router.parseUrl(router.url).queryParams).toEqual({ category: 'spring', difficulty: 'senior' });
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain('Spring transaction');
  });

  it('renders the complete bank when opened without query parameters', async () => {
    const harness = await RouterTestingHarness.create('/interview');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('[aria-label="Category"]')?.querySelectorAll('button')).toHaveLength(3);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain('Java object contract');
    expect(harness.routeNativeElement?.textContent).toContain('1 / 3');
  });

  it('reveals the layered answer for the selected question', async () => {
    const harness = await RouterTestingHarness.create('/interview?category=java&difficulty=junior');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('.answer')).toBeNull();
    harness.routeNativeElement?.querySelector<HTMLButtonElement>('.reveal')?.click();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('.answer')?.textContent).toContain('Giải thích ngắn');
    expect(harness.routeNativeElement?.querySelector('.production')?.textContent).toContain('Metrics');
  });
});

function findButton(root: HTMLElement | null, label: string): HTMLButtonElement | undefined {
  return [...(root?.querySelectorAll<HTMLButtonElement>('button') ?? [])].find((button) =>
    button.textContent?.replace(/\s+/g, ' ').trim().startsWith(label),
  );
}

function sampleQuestions(): InterviewQuestion[] {
  return [
    question('java-junior', 'Java', 'junior', 'Java object contract'),
    question('java-senior', 'Java', 'senior', 'JVM memory'),
    question('spring-senior', 'Spring', 'senior', 'Spring transaction'),
  ];
}

function question(id: string, category: InterviewQuestion['category'], difficulty: InterviewQuestion['difficulty'], title: string): InterviewQuestion {
  return {
    id,
    category,
    difficulty,
    topics: [category.toLowerCase()],
    question: title,
    answer30s: 'Giải thích ngắn cho câu hỏi.',
    answer2m: 'Giải thích chi tiết cho câu hỏi.',
    production: 'Metrics và logs cần theo dõi.',
    wrongAnswer: 'Câu trả lời sai thường gặp.',
    followUps: ['Follow-up một?', 'Follow-up hai?'],
    relatedLesson: '/learn/backend/java-object-contracts',
  };
}
