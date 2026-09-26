import yaml from 'js-yaml';
import { marked } from 'marked';
import { STRUCTURED_BLOCK_TYPES } from '../config.mjs';

const structuredKinds = new Set(STRUCTURED_BLOCK_TYPES);
const placeholderPrefix = 'CONTENTBLOCKTOKEN';
const markdownOptions = { gfm: true, breaks: false, pedantic: false, html: false };

export function parseMarkdownDocument(markdown, { file = '', diagnostics }) {
  const scanned = scanStructuredBlocks(markdown, file, diagnostics);
  const tokens = marked.lexer(scanned.markdown, markdownOptions);
  validateSafeTokens(tokens, file, diagnostics);

  const headings = [];
  const blocks = [];
  const usedHeadingIds = new Set();
  let documentTitle = '';

  for (const token of tokens) {
    if (token.type === 'space' || token.type === 'hr') continue;
    if (token.type === 'heading') {
      const text = cleanInlineText(token.text);
      const id = uniqueSlug(text, usedHeadingIds);
      if (token.depth === 1) {
        if (!documentTitle) documentTitle = text;
        continue;
      }
      const level = token.depth === 2 ? 2 : 3;
      const heading = { id, text, level, depth: token.depth };
      headings.push(heading);
      blocks.push({ type: 'heading', id, text, level });
      continue;
    }
    if (token.type === 'paragraph') {
      const placeholder = token.text.trim().match(new RegExp(`^${placeholderPrefix}(\\d+)$`));
      if (placeholder) {
        const structured = scanned.blocks[Number(placeholder[1])];
        if (structured) blocks.push(toRuntimeCallout(structured));
        continue;
      }
      const text = token.text.trim();
      const inline = inlineSegments(token.tokens);
      const paragraph = {
        type: 'paragraph',
        text,
      };
      if (requiresInlineRuns(inline, text)) paragraph.inline = inline;
      blocks.push(paragraph);
      continue;
    }
    if (token.type === 'list') {
      const items = token.items.map((item) => item.text.trim());
      const inlineItems = token.items.map((item) => inlineSegments(item.tokens));
      const list = {
        type: 'list',
        ordered: Boolean(token.ordered),
        items,
      };
      if (inlineItems.some((runs, index) => requiresInlineRuns(runs, items[index]))) {
        list.inlineItems = inlineItems;
      }
      blocks.push(list);
      continue;
    }
    if (token.type === 'code') {
      const { language, title } = parseCodeInfo(token.lang ?? '');
      if (language === 'mermaid') blocks.push({ type: 'diagram', code: token.text });
      else blocks.push({ type: 'code', language: language || 'text', title, code: token.text });
      continue;
    }
    if (token.type === 'table') {
      const headers = token.header.map((cell) => cell.text.trim());
      const rows = token.rows.map((row) => row.map((cell) => cell.text.trim()));
      const inlineHeaders = token.header.map((cell) => inlineSegments(cell.tokens));
      const inlineRows = token.rows.map((row) =>
        row.map((cell) => inlineSegments(cell.tokens)),
      );
      const table = {
        type: 'table',
        headers,
        rows,
      };
      const hasInlineHeader = inlineHeaders.some((runs, index) =>
        requiresInlineRuns(runs, headers[index]),
      );
      const hasInlineCell = inlineRows.some((row, rowIndex) =>
        row.some((runs, cellIndex) => requiresInlineRuns(runs, rows[rowIndex][cellIndex])),
      );
      if (hasInlineHeader || hasInlineCell) {
        table.inlineHeaders = inlineHeaders;
        table.inlineRows = inlineRows;
      }
      blocks.push(table);
      continue;
    }
    if (token.type === 'blockquote') {
      const text = token.text.trim();
      const inline = inlineSegments(token.tokens);
      const callout = {
        type: 'callout',
        kind: 'note',
        title: 'Ghi chú',
        text,
      };
      if (requiresInlineRuns(inline, text)) callout.inline = inline;
      blocks.push(callout);
      continue;
    }
    if (token.type === 'html') continue;
    const text = tokenText(token).trim();
    if (text) {
      const inline = inlineSegments(token.tokens);
      const paragraph = { type: 'paragraph', text };
      if (requiresInlineRuns(inline, text)) paragraph.inline = inline;
      blocks.push(paragraph);
    }
  }

  const sections = extractSections(tokens);
  const searchText = blocks
    .map(blockSearchText)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: documentTitle,
    headings: headings.map(({ id, text, level }) => ({ id, text, level })),
    allHeadings: collectAllHeadings(tokens),
    blocks,
    structuredBlocks: scanned.blocks,
    sections,
    searchText,
  };
}

export function scanStructuredBlocks(markdown, file, diagnostics) {
  const lines = String(markdown).replaceAll('\r\n', '\n').split('\n');
  const output = [];
  const blocks = [];
  let fence = '';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!fence) fence = marker;
      else if (marker === fence) fence = '';
      output.push(line);
      continue;
    }
    if (fence) {
      output.push(line);
      continue;
    }

    const opener = line.match(/^\s*:::([a-z][a-z0-9-]*)\s*(.*)$/i);
    if (!opener) {
      if (line.trim() === ':::') {
        diagnostics.error('block.unexpected-close', 'Structured block có dấu đóng không khớp.', file);
      }
      output.push(line);
      continue;
    }

    const kind = opener[1].toLowerCase();
    const title = opener[2].trim();
    const body = [];
    let depth = 1;
    let innerFence = '';
    let cursor = index + 1;
    for (; cursor < lines.length; cursor += 1) {
      const candidate = lines[cursor];
      const innerFenceMatch = candidate.match(/^\s*(`{3,}|~{3,})/);
      if (innerFenceMatch) {
        const marker = innerFenceMatch[1][0];
        if (!innerFence) innerFence = marker;
        else if (marker === innerFence) innerFence = '';
        body.push(candidate);
        continue;
      }
      if (!innerFence && /^\s*:::[a-z][a-z0-9-]*\b/i.test(candidate)) depth += 1;
      if (!innerFence && candidate.trim() === ':::') {
        depth -= 1;
        if (depth === 0) break;
      }
      body.push(candidate);
    }
    if (depth !== 0) {
      diagnostics.error('block.unclosed', `Structured block \`${kind}\` chưa được đóng.`, file);
      index = lines.length;
      continue;
    }
    index = cursor;
    if (!structuredKinds.has(kind)) {
      diagnostics.error('block.unknown', `Structured block không được hỗ trợ: ${kind}.`, file);
    }
    const raw = body.join('\n').trim();
    const data = parseStructuredData(kind, raw, file, diagnostics);
    const block = { kind, title, raw, data, index: blocks.length };
    blocks.push(block);
    output.push('', `${placeholderPrefix}${block.index}`, '');
  }

  return { markdown: output.join('\n'), blocks };
}

function parseStructuredData(kind, raw, file, diagnostics) {
  if (!['interview', 'flashcard', 'quiz', 'misconception', 'glossary'].includes(kind)) {
    validateFragment(raw, file, diagnostics);
    return undefined;
  }
  if (
    ['interview', 'quiz'].includes(kind) &&
    !/^\s*(?:id|question|difficulty|answer30s|answerDetailed|rubric):/m.test(raw)
  ) {
    validateFragment(raw, file, diagnostics);
    return undefined;
  }
  try {
    const data = yaml.load(raw, { schema: yaml.CORE_SCHEMA, json: false });
    if (!data || Array.isArray(data) || typeof data !== 'object') {
      diagnostics.error('block.payload', `Structured block \`${kind}\` phải chứa YAML mapping.`, file);
      return {};
    }
    const normalized = normalizeYamlValue(data);
    validateStructuredStrings(normalized, file, diagnostics);
    return normalized;
  } catch (error) {
    try {
      const data = yaml.load(quotePlainMappingScalars(raw), {
        schema: yaml.CORE_SCHEMA,
        json: false,
      });
      if (data && !Array.isArray(data) && typeof data === 'object') {
        const normalized = normalizeYamlValue(data);
        validateStructuredStrings(normalized, file, diagnostics);
        return normalized;
      }
    } catch {
      // Report the original parser failure below because it points at the author's source.
    }
    diagnostics.error(
      'block.payload',
      `Structured block \`${kind}\` có YAML không hợp lệ: ${error instanceof Error ? error.message : String(error)}`,
      file,
    );
    return {};
  }
}

function validateFragment(fragment, file, diagnostics) {
  if (!fragment) return;
  const tokens = marked.lexer(fragment, markdownOptions);
  validateSafeTokens(tokens, file, diagnostics);
}

function validateStructuredStrings(value, file, diagnostics) {
  if (typeof value === 'string') {
    validateFragment(value, file, diagnostics);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) validateStructuredStrings(item, file, diagnostics);
    return;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) validateStructuredStrings(item, file, diagnostics);
  }
}

function validateSafeTokens(tokens, file, diagnostics) {
  walkTokens(tokens, (token) => {
    if (token.type === 'html' && isUnsafeRawHtml(token.raw)) {
      diagnostics.error('markdown.raw-html', 'Raw HTML không được phép trong knowledge Markdown.', file);
    }
    if (token.type === 'link' && !isSafeLink(token.href)) {
      diagnostics.error('markdown.unsafe-link', `Link có protocol không an toàn: ${token.href}`, file);
    }
  });
}

function isUnsafeRawHtml(raw) {
  const value = String(raw).trim();
  if (/^<[A-Z][A-Za-z0-9_]*>$/.test(value)) return false;
  return true;
}

function walkTokens(tokens, visitor) {
  if (!Array.isArray(tokens)) return;
  for (const token of tokens) {
    if (!token || typeof token !== 'object') continue;
    visitor(token);
    if (Array.isArray(token.tokens)) walkTokens(token.tokens, visitor);
    if (Array.isArray(token.items)) {
      for (const item of token.items) walkTokens(item.tokens, visitor);
    }
    if (token.type === 'table') {
      for (const cell of token.header ?? []) walkTokens(cell.tokens, visitor);
      for (const row of token.rows ?? []) {
        for (const cell of row) walkTokens(cell.tokens, visitor);
      }
    }
  }
}

function isSafeLink(href) {
  const value = String(href ?? '').trim();
  if (!value) return false;
  const normalized = value.replace(/[\u0000-\u0020\u007f]+/g, '').toLowerCase();
  const scheme = normalized.match(/^([a-z][a-z0-9+.-]*):/i)?.[1];
  return !scheme || ['http', 'https', 'mailto', 'tel'].includes(scheme);
}

function toRuntimeCallout(block) {
  const calloutKind = {
    note: 'note',
    info: 'info',
    warning: 'warning',
    danger: 'danger',
    tip: 'tip',
    'best-practice': 'best-practice',
    production: 'production',
    interview: 'interview',
    flashcard: 'note',
    quiz: 'interview',
    misconception: 'warning',
    glossary: 'note',
  }[block.kind] ?? 'note';
  const data = block.data ?? {};
  const defaults = {
    note: 'Ghi chú',
    info: 'Thông tin',
    warning: 'Cảnh báo',
    danger: 'Quan trọng',
    tip: 'Gợi ý',
    'best-practice': 'Best practice',
    production: 'Production',
    interview: 'Phỏng vấn',
    flashcard: 'Flashcard',
    quiz: 'Quiz',
    misconception: 'Quan niệm sai',
    glossary: data.term || 'Thuật ngữ',
  };
  let text = block.raw;
  if (block.kind === 'interview') text = data.question ?? block.raw;
  if (block.kind === 'flashcard') text = data.front ?? data.question ?? block.raw;
  if (block.kind === 'misconception') {
    text = [data.claim, data.correction].filter(Boolean).join(' — ') || block.raw;
  }
  if (block.kind === 'glossary') text = data.definition ?? block.raw;
  const inline = inlineSegmentsFromMarkdown(String(text));
  const runtime = {
    type: 'callout',
    kind: calloutKind,
    title: block.title || defaults[block.kind] || block.kind,
    text: String(text).trim().replace(/\s+/g, ' '),
  };
  if (requiresInlineRuns(inline, runtime.text)) runtime.inline = inline;
  return runtime;
}

function inlineSegmentsFromMarkdown(markdown) {
  return inlineSegments(marked.lexer(String(markdown), markdownOptions));
}

function inlineSegments(tokens, context = {}) {
  const segments = [];

  const append = (text, inherited) => {
    const value = String(text ?? '');
    if (!value) return;
    const href = inherited.href;
    const segment = {
      type: href ? 'link' : 'text',
      text: value,
      strong: Boolean(inherited.strong),
      code: Boolean(inherited.code),
      ...(href
        ? { href, ...(inherited.title ? { title: inherited.title } : {}) }
        : {}),
    };
    const previous = segments.at(-1);
    if (
      previous &&
      previous.type === segment.type &&
      previous.strong === segment.strong &&
      previous.code === segment.code &&
      previous.href === segment.href &&
      previous.title === segment.title
    ) {
      previous.text += segment.text;
      return;
    }
    segments.push(segment);
  };

  const visit = (items, inherited) => {
    for (const token of items ?? []) {
      if (!token || typeof token !== 'object') continue;
      if (token.type === 'strong') {
        visit(token.tokens, { ...inherited, strong: true });
        continue;
      }
      if (token.type === 'codespan') {
        append(token.text, { ...inherited, code: true });
        continue;
      }
      if (token.type === 'link') {
        visit(token.tokens, {
          ...inherited,
          ...(isSafeLink(token.href)
            ? { href: token.href, title: token.title || undefined }
            : { href: undefined, title: undefined }),
        });
        continue;
      }
      if (token.type === 'br') {
        append('\n', inherited);
        continue;
      }
      if (Array.isArray(token.tokens)) {
        visit(token.tokens, inherited);
        continue;
      }
      if (Array.isArray(token.items)) {
        for (const item of token.items) visit(item.tokens, inherited);
        continue;
      }
      if (typeof token.text === 'string') append(token.text, inherited);
    }
  };

  visit(tokens, context);
  return segments;
}

function requiresInlineRuns(runs, fallbackText) {
  return !(
    runs.length === 1 &&
    runs[0].type === 'text' &&
    !runs[0].strong &&
    !runs[0].code &&
    runs[0].text === fallbackText
  );
}

function parseCodeInfo(info) {
  const match = String(info).trim().match(/^([^\s]+)?(?:\s+title=(?:"([^"]+)"|'([^']+)'|([^\s]+)))?/);
  return { language: match?.[1] ?? '', title: match?.[2] ?? match?.[3] ?? match?.[4] ?? '' };
}

function extractSections(tokens) {
  const sections = {};
  let current;
  for (const token of tokens) {
    if (token.type === 'heading') {
      const name = normalizeHeading(token.text);
      current = { heading: cleanInlineText(token.text), depth: token.depth, text: [], items: [] };
      sections[name] ??= current;
      continue;
    }
    if (!current || token.type === 'space') continue;
    const text = tokenText(token).trim();
    if (text) current.text.push(text);
    if (token.type === 'list') current.items.push(...token.items.map((item) => item.text.trim()));
  }
  return Object.fromEntries(
    Object.entries(sections).map(([name, section]) => [
      name,
      { ...section, text: section.text.join('\n').trim() },
    ]),
  );
}

function collectAllHeadings(tokens) {
  return tokens
    .filter((token) => token.type === 'heading')
    .map((token) => ({ depth: token.depth, text: cleanInlineText(token.text) }));
}

function blockSearchText(block) {
  if (block.type === 'heading' || block.type === 'paragraph' || block.type === 'callout') {
    return `${block.title ?? ''} ${inlinePlainText(block.inline, block.text)}`;
  }
  if (block.type === 'list') {
    return (block.inlineItems ?? block.items)
      .map((item) => inlinePlainText(item, item))
      .join(' ');
  }
  if (block.type === 'code' || block.type === 'diagram') return block.code;
  if (block.type === 'table') {
    const values = [
      ...(block.inlineHeaders ?? block.headers),
      ...(block.inlineRows ?? block.rows).flat(),
    ];
    return values.map((item) => inlinePlainText(item, item)).join(' ');
  }
  return '';
}

function inlinePlainText(value, fallback = '') {
  if (!Array.isArray(value)) return String(fallback ?? '');
  return value.map((segment) => segment.text).join('');
}

function tokenText(token) {
  if (!token || typeof token !== 'object') return '';
  if (typeof token.text === 'string') return token.text;
  if (token.type === 'list') return token.items.map((item) => item.text).join('\n');
  if (token.type === 'table') {
    return [...token.header, ...token.rows.flat()].map((cell) => cell.text).join(' ');
  }
  return String(token.raw ?? '');
}

function cleanInlineText(value) {
  return String(value)
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .trim();
}

export function normalizeHeading(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function slugify(value) {
  return normalizeHeading(value).replaceAll(' ', '-');
}

function uniqueSlug(value, used) {
  const base = slugify(value) || 'section';
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) candidate = `${base}-${suffix++}`;
  used.add(candidate);
  return candidate;
}

function normalizeYamlValue(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(normalizeYamlValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, normalizeYamlValue(item)]),
  );
}

function quotePlainMappingScalars(source) {
  return String(source)
    .split('\n')
    .map((line) => {
      const match = line.match(/^(\s*[A-Za-z][A-Za-z0-9_-]*:\s+)(.+)$/);
      if (!match) return line;
      const value = match[2].trim();
      if (
        !value ||
        /^[\[{"'|>]/.test(value) ||
        /^(?:true|false|null|~|-?\d+(?:\.\d+)?)$/i.test(value)
      ) {
        return line;
      }
      return `${match[1]}${JSON.stringify(value)}`;
    })
    .join('\n');
}
