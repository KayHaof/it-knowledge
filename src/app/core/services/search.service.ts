import { Injectable, inject } from '@angular/core';
import { ContentRepository } from './content-repository';
import { ContentType, LearningLevel, SearchDocument } from '../models/content.models';

export interface RankedSearchResult extends SearchDocument { score: number; excerpt: string }
export interface SearchFilters {
  technology?: string;
  level?: LearningLevel | 'all';
  contentType?: ContentType | 'all';
}

export interface SearchFacets {
  technologies: string[];
  levels: LearningLevel[];
  contentTypes: ContentType[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly repository = inject(ContentRepository);

  private index?: Promise<SearchDocument[]>;
  async search(query: string, filters: SearchFilters = {}, limit = 20): Promise<RankedSearchResult[]> {
    const normalizedQuery = normalize(query).trim().replace(/\s+/g, ' ');
    const terms = normalizedQuery.split(' ').filter((term) => term.length > 1);
    const hasFilters = Boolean(
      filters.technology && filters.technology !== 'all' ||
      filters.level && filters.level !== 'all' ||
      filters.contentType && filters.contentType !== 'all',
    );
    if (!terms.length && !hasFilters) return [];
    this.index ??= this.repository.searchIndex();
    return (await this.index)
      .filter((document) => matchesFilters(document, filters))
      .map((document) => terms.length ? rank(document, terms, normalizedQuery) : rankWithoutQuery(document))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'vi'))
      .slice(0, limit);
  }

  async facets(): Promise<SearchFacets> {
    this.index ??= this.repository.searchIndex();
    const documents = await this.index;
    return {
      technologies: [...new Set(documents.map((item) => item.technology))].sort((a, b) =>
        a.localeCompare(b, 'vi'),
      ),
      levels: [...new Set(documents.map((item) => item.level))],
      contentTypes: [...new Set(documents.map((item) => item.contentType))].sort(),
    };
  }
}

function matchesFilters(document: SearchDocument, filters: SearchFilters): boolean {
  return (
    (!filters.technology || filters.technology === 'all' || document.technology === filters.technology) &&
    (!filters.level || filters.level === 'all' || document.level === filters.level) &&
    (!filters.contentType || filters.contentType === 'all' || document.contentType === filters.contentType)
  );
}

function rankWithoutQuery(document: SearchDocument): RankedSearchResult {
  return { ...document, score: 1, excerpt: document.description };
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
