import yaml from 'js-yaml';

export function parseFrontmatter(source, file, diagnostics) {
  const normalized = String(source).replace(/^\uFEFF/, '').replaceAll('\r\n', '\n');
  if (!normalized.startsWith('---\n')) {
    diagnostics.error('frontmatter.missing', 'Thiếu YAML front matter mở đầu bằng `---`.', file);
    return { metadata: {}, markdown: normalized };
  }

  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) {
    diagnostics.error('frontmatter.unclosed', 'YAML front matter chưa được đóng bằng `---`.', file);
    return { metadata: {}, markdown: '' };
  }

  const yamlSource = normalized.slice(4, end);
  const markdown = normalized.slice(end + 5);
  try {
    const metadata = yaml.load(yamlSource, { schema: yaml.CORE_SCHEMA, json: false });
    if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
      diagnostics.error('frontmatter.object', 'Front matter phải là một YAML mapping.', file);
      return { metadata: {}, markdown };
    }
    return { metadata: normalizeYamlValue(metadata), markdown };
  } catch (error) {
    diagnostics.error(
      'frontmatter.invalid',
      error instanceof Error ? error.message : String(error),
      file,
    );
    return { metadata: {}, markdown };
  }
}

function normalizeYamlValue(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(normalizeYamlValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, normalizeYamlValue(item)]),
  );
}
