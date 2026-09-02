import { Injectable, inject } from '@angular/core';
import { ContentRepository } from './content-repository';
import { SearchDocument } from '../models/content.models';

export interface RankedSearchResult extends SearchDocument { score: number; excerpt: string }
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly repository = inject(ContentRepository);

  private index?: Promise<SearchDocument[]>;
  async search(query: string, limit = 20): Promise<RankedSearchResult[]> {
    const normalizedQuery = normalize(query).trim().replace(/\s+/g, ' ');
    const terms = normalizedQuery.split(' ').filter((term) => term.length > 1);
    if (!terms.length) return [];
    this.index ??= this.repository.searchIndex();
    return (await this.index)
      .map((document) => rank(document, terms, normalizedQuery))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'vi'))
      .slice(0, limit);
  }
}
function rank(document: SearchDocument, terms: string[], phrase: string): RankedSearchResult {
  const title = normalize(document.title);
  const tags = normalize(document.tags.join(' ') + ' ' + document.technology + ' ' + document.category);
  const body = normalize(document.description + ' ' + document.headings.join(' ') + ' ' + document.content);
  let score = 0;
  let matchedTerms = 0;
  for (const term of terms) {
    const matched = title.includes(term) || tags.includes(term) || body.includes(term);
    if (matched) matchedTerms++;
    if (title.includes(term)) score += 12;
    if (tags.includes(term)) score += 6;
    if (body.includes(term)) score += 2;
  }
  if (matchedTerms === terms.length) score += 20 + terms.length * 2;
  if (phrase.length > 1) {
    if (title.includes(phrase)) score += 30;
    if (tags.includes(phrase)) score += 14;
    if (body.includes(phrase)) score += 8;
  }
  const content = document.description + ' ' + document.content;
  const normalizedContent = normalize(content);
  const phraseIndex = normalizedContent.indexOf(phrase);
  const first = phraseIndex >= 0 ? phraseIndex : terms.map((term) => normalizedContent.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? 0;
  const excerpt = content.slice(Math.max(0, first - 55), first + 145).trim();
  return { ...document, score, excerpt: `${first > 55 ? '…' : ''}${excerpt}${content.length > first + 145 ? '…' : ''}` };
}
function normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
