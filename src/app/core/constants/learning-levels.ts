import { LearningLevel } from '../models/content.models';

export const LEARNING_LEVELS: readonly LearningLevel[] = ['basic', 'advanced', 'extended'];

export const LEARNING_LEVEL_LABELS: Readonly<Record<LearningLevel, string>> = {
  basic: 'Cơ bản',
  advanced: 'Nâng cao',
  extended: 'Mở rộng',
};
