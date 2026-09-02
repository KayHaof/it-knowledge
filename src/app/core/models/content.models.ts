export type LearningLevel = 'beginner' | 'intermediate' | 'advanced' | 'senior';
export type CalloutKind = 'note' | 'tip' | 'info' | 'warning' | 'danger' | 'best-practice' | 'interview' | 'production';

export interface SourceReference {
  title: string;
  url: string;
  organization: string;
  type:
    | 'official-documentation'
    | 'official-api-reference'
    | 'specification'
    | 'standard'
    | 'internet-standard'
    | 'best-current-practice'
    | 'primary-vendor'
    | 'primary-vendor-guidance'
    | 'primary-vendor-whitepaper'
    | 'security-guidance'
    | 'secondary';
  accessedAt: string;
}

export interface LessonMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technology: string;
  level: LearningLevel;
  estimatedMinutes: number;
  tags: string[];
  prerequisites: string[];
  related: string[];
  next: string;
  learningObjectives: string[];
  lastReviewed: string;
  appliesTo?: Record<string, string>;
  sources: SourceReference[];
}

export interface HeadingBlock { type: 'heading'; level: 2 | 3; id: string; text: string }
export interface ParagraphBlock { type: 'paragraph'; text: string }
export interface ListBlock { type: 'list'; ordered: boolean; items: string[] }
export interface CodeBlock { type: 'code'; language: string; title: string; code: string }
export interface DiagramBlock { type: 'diagram'; code: string }
export interface CalloutBlock { type: 'callout'; kind: CalloutKind; title: string; text: string }
export interface TableBlock { type: 'table'; headers: string[]; rows: string[][] }
export type ContentBlock = HeadingBlock | ParagraphBlock | ListBlock | CodeBlock | DiagramBlock | CalloutBlock | TableBlock;

export interface Lesson extends LessonMetadata {
  path: string;
  headings: { id: string; text: string; level: 2 | 3 }[];
  blocks: ContentBlock[];
  searchText: string;
}

export interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technology: string;
  level: LearningLevel;
  tags: string[];
  headings: string[];
  content: string;
  path: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'beginner' | 'junior' | 'middle' | 'senior' | 'system-design';
  topics: string[];
  question: string;
  answer30s: string;
  answer2m: string;
  deepDive?: string;
  production: string;
  wrongAnswer: string;
  followUps: string[];
  relatedLesson: string;
  sources?: SourceReference[];
}

export interface RoadmapDefinition {
  id: string;
  title: string;
  description: string;
  steps: { lessonId: string; note: string }[];
}
