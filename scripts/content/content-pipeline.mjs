#!/usr/bin/env node
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { ARTIFACT_FILES } from './config.mjs';
import { compileKnowledge } from './compilers/compile-content.mjs';
import { writeGeneratedArtifacts } from './generators/artifacts.mjs';
import { checkSourceLinks } from './link-checker.mjs';

export { parseFrontmatter } from './parsers/frontmatter.mjs';
export { parseMarkdownDocument, scanStructuredBlocks } from './parsers/markdown.mjs';
export { compileKnowledge } from './compilers/compile-content.mjs';
export { writeGeneratedArtifacts } from './generators/artifacts.mjs';

export async function runContentPipeline(mode = 'build', overrides = {}) {
  const supportedModes = new Set(['validate', 'build', 'index', 'stats', 'check-links']);
  if (!supportedModes.has(mode)) {
    throw new Error(`Unknown content command \`${mode}\`. Use: ${[...supportedModes].join(', ')}.`);
  }
  const compilation = await compileKnowledge(overrides);
  if (compilation.diagnostics.items.length) console.log(compilation.diagnostics.format());
  if (compilation.diagnostics.hasErrors) {
    throw new Error(`Content validation failed with ${compilation.diagnostics.errors.length} error(s).`);
  }

  if (mode === 'build') {
    await writeGeneratedArtifacts(compilation, ARTIFACT_FILES);
    console.log(`Generated ${ARTIFACT_FILES.length} deterministic artifacts.`);
  } else if (mode === 'index') {
    await writeGeneratedArtifacts(compilation, ['search-index.json']);
    console.log(`Indexed ${compilation.artifacts['search-index.json'].length} lessons.`);
  } else if (mode === 'stats') {
    await writeGeneratedArtifacts(compilation, ['content-stats.json']);
    console.log(JSON.stringify(compilation.artifacts['content-stats.json'], null, 2));
  } else if (mode === 'check-links') {
    const result = await checkSourceLinks(compilation, overrides.linkCheck);
    for (const warning of result.warnings) console.warn(`[WARNING] link.blocked ${warning}`);
    if (result.failures.length) {
      throw new Error(`Link check failed (${result.failures.length}):\n${result.failures.join('\n')}`);
    }
    console.log(`Checked ${result.checked} unique source URLs.`);
  } else {
    console.log(
      `Validated ${compilation.artifacts['lessons.json'].length} lessons, ` +
        `${compilation.artifacts['interview.json'].length} interview questions, ` +
        `${compilation.artifacts['flashcards.json'].length} flashcards and ` +
        `${compilation.artifacts['roadmaps.json'].length} roadmaps.`,
    );
  }
  return compilation;
}

const isEntryPoint = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isEntryPoint) {
  try {
    await runContentPipeline(process.argv[2] ?? 'build');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
