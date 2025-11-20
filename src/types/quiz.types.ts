export enum ViewState {
  LIST = 'LIST',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  correct: number; // Index of the correct answer
  explanation?: string;
}

export interface Quiz {
  quiz_id: string;
  user_id?: string;
  title?: string;          
  description?: string;
  questions?: QuizQuestionItem[];
  score?: number | null;
  time_taken?: number | null;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
