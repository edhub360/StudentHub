// src/types/quiz.types.ts

export enum ViewState {
  LIST = 'LIST',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

// Backend API response types
export interface QuizListItem {
  quiz_id: string;
  title: string;
  description: string;
  subject_tag: string;
  difficulty_level: string;
  estimated_time: number;
  total_questions: number;
  is_active: boolean;
}

export interface QuizQuestion {
  question_id: string;
  question_text: string;
  correct_answer: string;
  incorrect_answers: string[];
  explanation?: string;
  difficulty?: string;
}

export interface QuizDetail {
  quiz_id: string;
  title: string;
  description: string;
  subject_tag: string;
  difficulty_level: string;
  estimated_time: number;
  questions: QuizQuestion[];
}

// Frontend processing types
export interface ProcessedQuestion {
  question_id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface UserAnswer {
  question_id: string;
  user_answer: string;
  is_correct: boolean;
}

export interface QuizAttemptPayload {
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  score_percentage: number;
  time_taken: number;
  answers?: UserAnswer[];
}

export interface QuizAttemptResponse {
  attempt_id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  score_percentage: number;
  time_taken: number;
  completed_at: string;
}

export interface UserQuizHistory {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  subject_tag: string;
  difficulty_level: string;
  score: number;
  total_questions: number;
  score_percentage: number;
  time_taken: number;
  completed_at: string;
}

export interface QuizStatistics {
  quiz_id: string;
  title: string;
  total_users_attempted: number;
  total_attempts: number;
  average_score?: number;
  highest_score?: number;
  lowest_score?: number;
  average_time?: number;
}

// Legacy types (for backward compatibility if needed)
export interface QuizQuestionItem {
  question: string;
  options: string[];
  correct: number;
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

// Helper function to convert backend questions to frontend format
export function processQuizQuestions(questions: QuizQuestion[]): ProcessedQuestion[] {
  return questions.map(q => {
    const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(q.correct_answer);
    
    return {
      question_id: q.question_id,
      question: q.question_text,
      options,
      correctIndex,
      explanation: q.explanation
    };
  });
}
