import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InlineLinkRun, InlineRun } from '../../../core/models/content.models';

export type InlineSegment = InlineRun;

export function parseInlineText(value: string): InlineSegment[] {
  const supportsStrong = (value.match(/\*\*/g)?.length ?? 0) % 2 === 0;
  const supportsCode = (value.match(/`/g)?.length ?? 0) % 2 === 0;
  const segments: InlineSegment[] = [];
  let buffer = '';
  let strong = false;
  let code = false;

  const flush = (): void => {
    if (!buffer) return;
    segments.push({ type: 'text', text: buffer, strong, code });
    buffer = '';
  };

  for (let index = 0; index < value.length; index += 1) {
    if (supportsStrong && !code && value.startsWith('**', index)) {
      flush();
      strong = !strong;
      index += 1;
      continue;
    }
    if (supportsCode && value[index] === '`') {
      flush();
      code = !code;
      continue;
    }
    buffer += value[index];
  }
  flush();
  return segments;
}

export function safeInlineHref(href: string): string | null {
  const value = href.trim();
  if (!value) return null;
  const normalized = Array.from(value)
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint > 0x20 && codePoint !== 0x7f;
    })
    .join('')
    .toLowerCase();
  const scheme = normalized.match(/^([a-z][a-z0-9+.-]*):/i)?.[1];
  return !scheme || ['http', 'https', 'mailto', 'tel'].includes(scheme) ? value : null;
}

interface RenderedInlineLink extends InlineLinkRun {
  external: boolean;
  internal: boolean;
}

type RenderedInlineSegment = Exclude<InlineRun, InlineLinkRun> | RenderedInlineLink;

@Component({
  selector: 'app-inline-text',
  imports: [RouterLink],
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.type === 'link') {
        @if (segment.internal) {
          <a [routerLink]="segment.href" [attr.title]="segment.title || null">
            @if (segment.code) {
              <code [class.strong-code]="segment.strong">{{ segment.text }}</code>
            } @else if (segment.strong) {
              <strong>{{ segment.text }}</strong>
            } @else {
              {{ segment.text }}
            }
          </a>
        } @else {
          <a
            [attr.href]="segment.href"
            [attr.title]="segment.title || null"
            [attr.target]="segment.external ? '_blank' : null"
            [attr.rel]="segment.external ? 'noopener noreferrer' : null"
          >
            @if (segment.code) {
              <code [class.strong-code]="segment.strong">{{ segment.text }}</code>
            } @else if (segment.strong) {
              <strong>{{ segment.text }}</strong>
            } @else {
              {{ segment.text }}
            }
          </a>
        }
      } @else if (segment.code) {
          <code [class.strong-code]="segment.strong">{{ segment.text }}</code>
        } @else if (segment.strong) {
          <strong>{{ segment.text }}</strong>
        } @else {
          {{ segment.text }}
        }
      }
  `,
  styles: `
    :host { display: contents; }
    a { color: var(--primary); text-decoration-thickness: .08em; text-underline-offset: .16em; }
    a:hover { text-decoration-thickness: .12em; }
    code { padding: .1em .35em; border: 1px solid var(--border); border-radius: 4px; background: var(--surface-raised); color: var(--primary); font-size: .9em; }
    .strong-code { font-weight: 750; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineText {
  readonly text = input('');
  readonly inline = input<InlineRun[]>();
  protected readonly segments = computed<RenderedInlineSegment[]>(() => {
    const source = this.inline() ?? parseInlineText(this.text());
    return source.map((segment) => {
      if (segment.type !== 'link') return segment;
      const href = safeInlineHref(segment.href);
      if (!href) {
        return {
          type: 'text',
          text: segment.text,
          strong: segment.strong,
          code: segment.code,
        };
      }
      return {
        ...segment,
        href,
        external: /^(?:https?:)?\/\//i.test(href),
        internal:
          !href.startsWith('#') &&
          !/^(?:https?|mailto|tel):/i.test(href) &&
          !href.startsWith('//'),
      };
    });
  });
}
