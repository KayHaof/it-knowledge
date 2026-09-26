import { ContentValidationError } from './diagnostics.mjs';

export async function checkSourceLinks(
  compilation,
  { fetchImpl = globalThis.fetch, timeoutMs = 12_000, concurrency = 6 } = {},
) {
  if (compilation.diagnostics.hasErrors) throw new ContentValidationError(compilation.diagnostics);
  if (typeof fetchImpl !== 'function') throw new Error('Global fetch is unavailable.');
  const sourceUrls = [
    ...new Set(
      [
        ...compilation.artifacts['lessons.json'],
        ...compilation.artifacts['interview.json'],
      ].flatMap((item) => (item.sources ?? []).map((source) => source.url)),
    ),
  ].sort();
  const failures = [];
  const warnings = [];
  let cursor = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, sourceUrls.length || 1)) },
    async () => {
      while (cursor < sourceUrls.length) {
        const url = sourceUrls[cursor++];
        try {
          let response = await fetchImpl(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(timeoutMs),
          });
          if ([403, 405].includes(response.status)) {
            response = await fetchImpl(url, {
              method: 'GET',
              redirect: 'follow',
              headers: { 'user-agent': 'IT-Knowledge-Link-Checker/1.0' },
              signal: AbortSignal.timeout(timeoutMs),
            });
          }
          if ([401, 403, 429].includes(response.status)) {
            warnings.push(`${response.status} ${url}`);
          } else if (!response.ok) failures.push(`${response.status} ${url}`);
        } catch (error) {
          failures.push(`${error instanceof Error ? error.message : String(error)} ${url}`);
        }
      }
    },
  );
  await Promise.all(workers);
  failures.sort();
  warnings.sort();
  return { checked: sourceUrls.length, failures, warnings };
}
