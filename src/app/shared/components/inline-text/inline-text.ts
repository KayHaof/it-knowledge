import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface InlineSegment {
  text: string;
  strong: boolean;
  code: boolean;
}

export function parseInlineText(value: string): InlineSegment[] {
  const supportsStrong = (value.match(/\*\*/g)?.length ?? 0) % 2 === 0;
  const supportsCode = (value.match(/`/g)?.length ?? 0) % 2 === 0;
  const segments: InlineSegment[] = [];
  let buffer = '';
  let strong = false;
  let code = false;

  const flush = (): void => {
    if (!buffer) return;
    segments.push({ text: buffer, strong, code });
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

@Component({
  selector: 'app-inline-text',
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.code) {
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
    code { padding: .1em .35em; border: 1px solid var(--border); border-radius: 4px; background: var(--surface-raised); color: var(--primary); font-size: .9em; }
    .strong-code { font-weight: 750; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineText {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => parseInlineText(this.text()));
}
