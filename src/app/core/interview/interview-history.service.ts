import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import {
  EvaluableInterviewQuestion,
  InterviewEvaluation,
  InterviewHistoryEntry,
} from './interview-evaluation.models';

const STORAGE_KEY = 'it-learning-platform:v1:interview-history';
const HISTORY_LIMIT = 100;

interface StoredInterviewHistory {
  version: 1;
  entries: InterviewHistoryEntry[];
}

const emptyHistory = (): StoredInterviewHistory => ({ version: 1, entries: [] });

@Injectable({ providedIn: 'root' })
export class InterviewHistoryService {
  private readonly storage = inject(StorageService);
  private readonly state = signal(this.readInitialState());

  readonly entries = this.state.asReadonly();

  add(
    question: EvaluableInterviewQuestion,
    answer: string,
    evaluation: InterviewEvaluation,
    timestamp = new Date(),
  ): InterviewHistoryEntry {
    const entry: InterviewHistoryEntry = {
      questionId: question.id,
      question: question.question,
      technology: question.technology || question.category,
      category: question.category,
      difficulty: question.difficulty,
      answer: answer.trim(),
      evaluation,
      timestamp: timestamp.toISOString(),
    };
    this.state.update((entries) => [entry, ...entries].slice(0, HISTORY_LIMIT));
    this.persist();
    return entry;
  }

  clear(): void {
    this.state.set([]);
    this.persist();
  }

  private readInitialState(): InterviewHistoryEntry[] {
    const stored = this.storage.read<StoredInterviewHistory>(STORAGE_KEY, emptyHistory());
    if (stored.version !== 1 || !Array.isArray(stored.entries)) return [];
    return stored.entries
      .map(normalizeHistoryEntry)
      .filter((entry): entry is InterviewHistoryEntry => Boolean(entry))
      .slice(0, HISTORY_LIMIT);
  }

  private persist(): void {
    this.storage.write<StoredInterviewHistory>(STORAGE_KEY, {
      version: 1,
      entries: this.state(),
    });
  }
}

function normalizeHistoryEntry(value: unknown): InterviewHistoryEntry | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const entry = value as Partial<InterviewHistoryEntry>;
  if (
    typeof entry.questionId !== 'string' ||
    typeof entry.question !== 'string' ||
    typeof entry.answer !== 'string' ||
    typeof entry.timestamp !== 'string' ||
    typeof entry.category !== 'string' ||
    !isDifficulty(entry.difficulty) ||
    typeof entry.evaluation?.score !== 'number'
  ) {
    return undefined;
  }
  return {
    ...entry,
    technology:
      typeof entry.technology === 'string' && entry.technology.trim()
        ? entry.technology
        : entry.category,
  } as InterviewHistoryEntry;
}

function isDifficulty(value: unknown): value is InterviewHistoryEntry['difficulty'] {
  return value === 'junior' || value === 'middle' || value === 'senior' || value === 'system-design';
}
