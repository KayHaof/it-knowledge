import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function walkMarkdownFiles(directory) {
  if (!(await pathExists(directory))) return [];
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    if (entry.name === '_config' || entry.name.startsWith('.')) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkMarkdownFiles(target)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) files.push(target);
  }
  return files;
}

export function relativePath(projectRoot, file) {
  return path.relative(projectRoot, file).replaceAll('\\', '/');
}

export async function readJsonIfPresent(file) {
  if (!(await pathExists(file))) return undefined;
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

export async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${stableStringify(value)}\n`, 'utf8');
}

export function stableStringify(value) {
  return JSON.stringify(sortObjectKeys(value), null, 2);
}

function sortObjectKeys(value) {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (!value || typeof value !== 'object' || value instanceof Date) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortObjectKeys(value[key])]),
  );
}
