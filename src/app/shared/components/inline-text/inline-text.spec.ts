import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { InlineText, parseInlineText, safeInlineHref } from './inline-text';

describe('parseInlineText', () => {
  it('parses nested inline code inside strong text without producing HTML', () => {
    expect(parseInlineText('**Dùng `equals` đúng**')).toEqual([
      { type: 'text', text: 'Dùng ', strong: true, code: false },
      { type: 'text', text: 'equals', strong: true, code: true },
      { type: 'text', text: ' đúng', strong: true, code: false },
    ]);
  });

  it('preserves unmatched delimiters as plain text', () => {
    expect(parseInlineText('Giá trị `chưa đóng')).toEqual([
      { type: 'text', text: 'Giá trị `chưa đóng', strong: false, code: false },
    ]);
  });

  it('allows only safe web, contact and relative href values', () => {
    expect(safeInlineHref('https://angular.dev/guide')).toBe('https://angular.dev/guide');
    expect(safeInlineHref('../guide')).toBe('../guide');
    expect(safeInlineHref('java\nscript:alert(1)')).toBeNull();
    expect(safeInlineHref('data:text/html,unsafe')).toBeNull();
  });

  it('renders typed links as anchors while preserving strong and code runs', async () => {
    await TestBed.configureTestingModule({
      imports: [InlineText],
      providers: [provideRouter([]), { provide: APP_BASE_HREF, useValue: '/it-knowledge/' }],
    }).compileComponents();
    const fixture = TestBed.createComponent(InlineText);
    fixture.componentRef.setInput('inline', [
      {
        type: 'link',
        text: 'Angular docs',
        href: 'https://angular.dev/guide',
        title: 'Official guide',
        strong: true,
        code: false,
      },
      { type: 'text', text: ' với ', strong: false, code: false },
      { type: 'text', text: 'RouterLink', strong: false, code: true },
    ]);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const anchor = root.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('https://angular.dev/guide');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(anchor?.querySelector('strong')?.textContent).toBe('Angular docs');
    expect(root.querySelector('code')?.textContent).toBe('RouterLink');
    expect(root.textContent).not.toContain('[Angular docs]');
  });

  it('renders an unsafe typed href as plain text instead of an anchor', async () => {
    await TestBed.configureTestingModule({
      imports: [InlineText],
      providers: [provideRouter([]), { provide: APP_BASE_HREF, useValue: '/it-knowledge/' }],
    }).compileComponents();
    const fixture = TestBed.createComponent(InlineText);
    fixture.componentRef.setInput('inline', [
      {
        type: 'link',
        text: 'Không an toàn',
        href: 'java\tscript:alert(1)',
        strong: false,
        code: false,
      },
    ]);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('a')).toBeNull();
    expect(root.textContent?.trim()).toBe('Không an toàn');
  });

  it('uses RouterLink so an internal lesson URL retains the configured base href', async () => {
    await TestBed.configureTestingModule({
      imports: [InlineText],
      providers: [provideRouter([]), { provide: APP_BASE_HREF, useValue: '/it-knowledge/' }],
    }).compileComponents();
    const fixture = TestBed.createComponent(InlineText);
    fixture.componentRef.setInput('inline', [
      {
        type: 'link',
        text: 'Bài JVM',
        href: '/learn/java/jvm',
        strong: false,
        code: false,
      },
    ]);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('a')?.getAttribute('href')).toBe(
      '/it-knowledge/learn/java/jvm',
    );
  });
});
