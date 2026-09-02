import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Lesson } from '../../core/models/content.models';
import { ContentRepository } from '../../core/services/content-repository';
import { LearningStateService } from '../../core/services/learning-state.service';
import { Catalog } from './catalog';

describe('Catalog', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Catalog],
      providers: [
        provideRouter(
          [{ path: 'learn/:category', component: Catalog }],
          withComponentInputBinding(),
        ),
        {
          provide: ContentRepository,
          useValue: {
            lessons: () => Promise.resolve(backendLessons()),
            roadmaps: () => Promise.resolve([]),
          },
        },
      ],
    }).compileComponents();
  });

  it('restores composed filters from the URL and preserves technology when level changes', async () => {
    const state = TestBed.inject(LearningStateService);
    state.setProgress('jpa-context', 'completed');
    const harness = await RouterTestingHarness.create(
      '/learn/backend?technology=jpa&level=advanced&ref=shared',
    );
    await harness.fixture.whenStable();
    harness.detectChanges();

    const page = harness.routeNativeElement;
    expect(page).not.toBeNull();
    expect(findButton(page, 'JPA / Hibernate')?.getAttribute('aria-pressed')).toBe('true');
    expect(findButton(page, 'Advanced')?.getAttribute('aria-pressed')).toBe('true');
    expect(page?.querySelectorAll('app-lesson-list-item')).toHaveLength(1);
    expect(page?.querySelector('[data-status="completed"]')).not.toBeNull();

    const seniorButton = findButton(page, 'Senior');
    expect(seniorButton).toBeDefined();
    seniorButton?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const queryParams = TestBed.inject(Router).parseUrl(TestBed.inject(Router).url).queryParams;
    expect(queryParams['technology']).toBe('jpa');
    expect(queryParams['level']).toBe('senior');
    expect(queryParams['ref']).toBe('shared');
    expect(harness.routeNativeElement?.textContent).toContain('JPA Locking');
    expect(harness.routeNativeElement?.textContent).not.toContain('JPA Context');

  });

  it('falls back to both All filters for invalid query parameters', async () => {
    const harness = await RouterTestingHarness.create(
      '/learn/backend?technology=unknown&level=expert',
    );
    await harness.fixture.whenStable();
    harness.detectChanges();

    const filterGroups = harness.routeNativeElement?.querySelectorAll('app-catalog-filter-tabs');
    expect(filterGroups).toHaveLength(2);
    filterGroups?.forEach((group) => {
      expect(group.querySelector('button[aria-pressed="true"]')?.textContent).toContain('Tất cả');
    });
    expect(harness.routeNativeElement?.querySelectorAll('app-lesson-list-item')).toHaveLength(10);
  });

  it('reuses the existing bookmark state from a lesson row', async () => {
    const harness = await RouterTestingHarness.create(
      '/learn/backend?technology=jpa&level=advanced',
    );
    await harness.fixture.whenStable();
    harness.detectChanges();

    const bookmark = harness.routeNativeElement?.querySelector<HTMLButtonElement>('.bookmark');
    expect(bookmark?.getAttribute('aria-pressed')).toBe('false');
    bookmark?.click();
    harness.detectChanges();

    expect(bookmark?.getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(LearningStateService).isBookmarked('jpa-context')).toBe(true);
  });
});

function findButton(root: HTMLElement | null, label: string): HTMLButtonElement | undefined {
  return [...(root?.querySelectorAll<HTMLButtonElement>('button') ?? [])].find((button) =>
    button.textContent?.replace(/\s+/g, ' ').trim().startsWith(label),
  );
}

function backendLessons(): Lesson[] {
  return [
    createLesson('java-object', 'Java Object', 'beginner', 'Java', ['java']),
    createLesson('java-collections', 'Java Collections', 'intermediate', 'Java', ['java']),
    createLesson('jvm-memory', 'JVM Memory', 'intermediate', 'Java / JVM', ['java', 'jvm']),
    createLesson('jvm-profile', 'JVM Profile', 'senior', 'Java / JVM', ['java', 'jvm']),
    createLesson('spring-core', 'Spring Core', 'intermediate', 'Spring', ['spring'], ['java-object']),
    createLesson('spring-boot', 'Spring Boot', 'advanced', 'Spring Boot', ['spring-boot'], ['spring-core']),
    createLesson('jpa-context', 'JPA Context', 'advanced', 'JPA / Hibernate', ['jpa', 'hibernate'], ['spring-core']),
    createLesson('jpa-locking', 'JPA Locking', 'senior', 'Spring Data JPA / Hibernate', ['spring', 'jpa', 'hibernate'], ['jpa-context']),
    createLesson('java-errors', 'Java Errors', 'beginner', 'Java', ['java']),
    createLesson('spring-testing', 'Spring Testing', 'intermediate', 'Spring Boot', ['spring-boot'], ['spring-core']),
  ];
}

function createLesson(
  id: string,
  title: string,
  level: Lesson['level'],
  technology: string,
  tags: string[],
  prerequisites: string[] = [],
): Lesson {
  return {
    id,
    slug: id,
    title,
    description: '',
    category: 'backend',
    technology,
    level,
    estimatedMinutes: 55,
    tags,
    prerequisites,
    related: [],
    next: '',
    learningObjectives: [],
    lastReviewed: '2026-09-01',
    sources: [],
    path: '/learn/backend/' + id,
    headings: [],
    blocks: [],
    searchText: '',
  };
}
