// src/constants/quiz.constants.ts

export const API_BASE_URL = 'https://quiz-backend-91248372939.us-central1.run.app';

export const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export const QUESTION_TIMER_SECONDS = 30;

export const GRADIENT_BG = "bg-gray-50";

// New constants for the updated architecture
export const APP_CONFIG = {
  enableTimer: true,
  showExplanations: true,
  autoSubmitOnComplete: true,
  offlineModeEnabled: true,
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  'Easy': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Hard': 'bg-red-100 text-red-800',
};

export const SUBJECT_ICONS: Record<string, string> = {
  'Programming': '💻',
  'General Knowledge': '📚',
  'Mathematics': '🔢',
  'Science': '🔬',
  'History': '📜',
  'Language': '🗣️',
};
