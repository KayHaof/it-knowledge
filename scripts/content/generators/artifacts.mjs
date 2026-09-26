import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ARTIFACT_FILES } from '../config.mjs';
import { ContentValidationError } from '../diagnostics.mjs';
import { writeJson } from '../utilities/files.mjs';

export async function writeGeneratedArtifacts(compilation, selectedFiles = ARTIFACT_FILES) {
  if (compilation.diagnostics.hasErrors) {
    throw new ContentValidationError(compilation.diagnostics);
  }
  const files = [...new Set(selectedFiles)];
  for (const file of files) {
    if (!ARTIFACT_FILES.includes(file) || !(file in compilation.artifacts)) {
      throw new Error(`Unknown generated artifact: ${file}`);
    }
  }
  await fs.mkdir(compilation.config.outputRoot, { recursive: true });
  for (const file of files.sort()) {
    const target = path.join(compilation.config.outputRoot, file);
    await writeJson(target, compilation.artifacts[file]);
    JSON.parse(await fs.readFile(target, 'utf8'));
  }
  return files.map((file) => path.join(compilation.config.outputRoot, file));
}
