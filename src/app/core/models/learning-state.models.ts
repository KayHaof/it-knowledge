export type ProgressStatus = 'not-started' | 'in-progress' | 'completed' | 'review';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface LearningData {
  version: 1;
  progress: Record<string, ProgressStatus>;
  bookmarks: string[];
  recent: string[];
  masteredQuestions: string[];
  reviewQuestions: string[];
  settings: { theme: ThemePreference };
}
