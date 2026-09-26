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

  it('submits an answer, shows transparent scoring and persists local history', async () => {
    const harness = await RouterTestingHarness.create('/interview?category=java&difficulty=junior');
    await harness.fixture.whenStable();
    harness.detectChanges();

    const textarea = harness.routeNativeElement?.querySelector<HTMLTextAreaElement>('textarea');
    if (!textarea) throw new Error('Expected interview answer textarea');
    textarea.value = [
      'Java có object contract vì equals và hashCode phải nhất quán.',
      'Trong production tôi theo dõi metrics và logs, nhưng cân nhắc trade-off latency.',
    ].join(' ');
    textarea.dispatchEvent(new Event('input'));
    harness.detectChanges();
    findButton(harness.routeNativeElement, 'Nộp câu trả lời')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('.evaluation')?.textContent).toContain('/100');
    expect(harness.routeNativeElement?.querySelector('.dimension-grid')?.children).toHaveLength(6);
    expect(harness.routeNativeElement?.querySelector('.answer')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('.history-list')?.textContent).toContain(
      'Java object contract',
    );
    expect(harness.routeNativeElement?.querySelector('.history-list')?.textContent).toContain(
      'java · Java · Junior',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Đây không phải đánh giá ngữ nghĩa bằng AI');
  });

  it('opens a matching follow-up question through its stable query id', async () => {
    const harness = await RouterTestingHarness.create('/interview?category=java&difficulty=junior');
    await harness.fixture.whenStable();
    harness.detectChanges();

    findButton(harness.routeNativeElement, 'Hiện đáp án tham khảo')?.click();
    harness.detectChanges();
    harness.routeNativeElement
      ?.querySelector<HTMLAnchorElement>('a.follow-up-link')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const router = TestBed.inject(Router);
    expect(router.parseUrl(router.url).queryParams).toEqual({
      category: 'java',
      difficulty: 'senior',
      questionId: 'java-senior',
    });
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain('JVM memory');
  });

  it('opens an unmatched follow-up as an unscored self-practice prompt', async () => {
    const harness = await RouterTestingHarness.create('/interview?category=java&difficulty=junior');
    await harness.fixture.whenStable();
    harness.detectChanges();

    const textarea = harness.routeNativeElement?.querySelector<HTMLTextAreaElement>('textarea');
    if (!textarea) throw new Error('Expected interview answer textarea');
    textarea.value = 'Java object contract cần equals và hashCode.';
    textarea.dispatchEvent(new Event('input'));
    harness.detectChanges();
    findButton(harness.routeNativeElement, 'Nộp câu trả lời')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('.evaluation')).not.toBeNull();

    findButton(harness.routeNativeElement, 'Follow-up chưa có rubric')?.click();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain(
      'Follow-up chưa có rubric?',
    );
    expect(findButton(harness.routeNativeElement, 'Chưa có rubric riêng')?.disabled).toBe(true);
    expect(harness.routeNativeElement?.textContent).toContain('không chấm điểm hoặc lưu vào lịch sử');
    expect(harness.routeNativeElement?.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe('');
    expect(harness.routeNativeElement?.querySelector('.evaluation')).toBeNull();
    expect(harness.routeNativeElement?.querySelectorAll('.history-list > li')).toHaveLength(1);

    findButton(harness.routeNativeElement, '← Quay về câu gốc')?.click();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain(
      'Java object contract',
    );
  });

  it('clears interview history only after an explicit confirmation', async () => {
    const harness = await RouterTestingHarness.create('/interview');
    await harness.fixture.whenStable();
    harness.detectChanges();

    const textarea = harness.routeNativeElement?.querySelector<HTMLTextAreaElement>('textarea');
    if (!textarea) throw new Error('Expected interview answer textarea');
    textarea.value = 'Java object contract cần equals và hashCode.';
    textarea.dispatchEvent(new Event('input'));
    harness.detectChanges();
    findButton(harness.routeNativeElement, 'Nộp câu trả lời')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    findButton(harness.routeNativeElement, 'Xóa lịch sử')?.click();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Xóa toàn bộ câu trả lời');
    findButton(harness.routeNativeElement, 'Xác nhận xóa')?.click();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('.history-list')).toBeNull();
    expect(harness.routeNativeElement?.textContent).toContain('Chưa có lần luyện nào');
  });
});

function findButton(root: HTMLElement | null, label: string): HTMLButtonElement | undefined {
  return [...(root?.querySelectorAll<HTMLButtonElement>('button') ?? [])].find((button) =>
    button.textContent?.replace(/\s+/g, ' ').trim().startsWith(label),
  );
}

function sampleQuestions(): InterviewQuestion[] {
  return [
    question('java-junior', 'Java', 'junior', 'Java object contract', [
      'JVM memory',
      'Follow-up chưa có rubric?',
    ]),
    question('java-senior', 'Java', 'senior', 'JVM memory'),
    question('spring-senior', 'Spring', 'senior', 'Spring transaction'),
  ];
}

function question(
  id: string,
  category: InterviewQuestion['category'],
  difficulty: InterviewQuestion['difficulty'],
  title: string,
  followUps = ['Follow-up một?', 'Follow-up hai?'],
): InterviewQuestion {
  return {
    id,
    technology: category.toLowerCase(),
    category,
    difficulty,
    topics: [category.toLowerCase()],
    question: title,
    answer30s: 'Giải thích ngắn cho câu hỏi.',
    answerDetailed: 'Giải thích chi tiết cho câu hỏi.',
    answer2m: 'Giải thích chi tiết cho câu hỏi.',
    production: 'Metrics và logs cần theo dõi.',
    tradeoffs: 'Đánh đổi latency, throughput và complexity.',
    wrongAnswer: 'Câu trả lời sai thường gặp.',
    followUps,
    relatedLessons: ['java-object-contracts'],
    relatedLesson: '/learn/backend/java-object-contracts',
    sources: [],
    rubric: {
      dimensions: {
        technicalCorrectness: 40,
        completeness: 20,
        reasoning: 15,
        production: 10,
        tradeoffs: 10,
        communication: 5,
      },
      concepts: [
        {
          id: category.toLowerCase(),
          aliases: [category.toLowerCase()],
          required: true,
          points: { technicalCorrectness: 40 },
        },
      ],
      misconceptions: [],
    },
  };
}
