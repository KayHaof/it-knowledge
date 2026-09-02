import { describe, expect, it } from 'vitest';
import { parseInlineText } from './inline-text';

describe('parseInlineText', () => {
  it('parses nested inline code inside strong text without producing HTML', () => {
    expect(parseInlineText('**Dùng `equals` đúng**')).toEqual([
      { text: 'Dùng ', strong: true, code: false },
      { text: 'equals', strong: true, code: true },
      { text: ' đúng', strong: true, code: false },
    ]);
  });

  it('preserves unmatched delimiters as plain text', () => {
    expect(parseInlineText('Giá trị `chưa đóng')).toEqual([
      { text: 'Giá trị `chưa đóng', strong: false, code: false },
    ]);
  });
});
