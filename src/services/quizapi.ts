// src/services/quizapi.ts
import axios, { AxiosError } from 'axios';
import {
  QuizListItem,
  QuizDetail,
  QuizQuestion,
  ProcessedQuestion,
  QuizAttemptPayload,
  QuizAttemptResponse,
  UserQuizHistory,
  QuizStatistics,
  User,
  Quiz,
  QuizQuestionItem
} from '../types/quiz.types';
import { API_BASE_URL } from '../constants/quiz.constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Mock data for demo/offline mode
const MOCK_QUIZZES: QuizListItem[] = [
  {
    quiz_id: 'mock-quiz-001',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics',
    subject_tag: 'Programming',
    difficulty_level: 'Easy',
    estimated_time: 5,
    total_questions: 3,
    is_active: true
  }
];

const MOCK_QUIZ_DETAIL: QuizDetail = {
  quiz_id: 'mock-quiz-001',
  title: 'React Fundamentals',
  description: 'Test your knowledge of React basics',
  subject_tag: 'Programming',
  difficulty_level: 'Easy',
  estimated_time: 5,
  questions: [
    {
      question_id: 'mock-q1',
      question_text: "What is the primary purpose of the useEffect hook in React?",
      correct_answer: "To manage side effects like data fetching",
      incorrect_answers: [
        "To handle component styling",
        "To create global state",
        "To optimize rendering performance"
      ],
      explanation: "useEffect is specifically designed to handle side effects (fetching data, subscriptions, manual DOM changes) in functional components.",
      difficulty: 'easy'
    },
    {
      question_id: 'mock-q2',
      question_text: "Which CSS utility class would you use in Tailwind to make text bold?",
      correct_answer: "font-bold",
      incorrect_answers: ["font-heavy", "text-bold", "bold"],
      explanation: "Tailwind CSS uses 'font-bold' to apply bold font weight.",
      difficulty: 'easy'
    },
    {
      question_id: 'mock-q3',
      question_text: "What does API stand for?",
      correct_answer: "Application Programming Interface",
      incorrect_answers: [
        "Advanced Programming Integration",
        "Application Process Integration",
        "Advanced Protocol Interface"
      ],
      explanation: "API stands for Application Programming Interface, which allows different software applications to communicate with each other.",
      difficulty: 'easy'
    }
  ]
};

/**
 * HELPER: Shuffle array in place (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * HELPER: Process questions from backend format to frontend format
 */
export const processQuestions = (questions: QuizQuestion[]): ProcessedQuestion[] => {
  return questions.map(q => {
    const allOptions = [...q.incorrect_answers, q.correct_answer];
    const shuffledOptions = shuffleArray(allOptions);
    const correctIndex = shuffledOptions.indexOf(q.correct_answer);

    return {
      question_id: q.question_id,
      question: q.question_text,
      options: shuffledOptions,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: q.explanation
    };
  });
};

/**
 * NEW API: Get all active quizzes
 */
export const fetchQuizzes = async (): Promise<QuizListItem[]> => {
  try {
    const response = await apiClient.get<QuizListItem[]>('/quizzes');

    if (!Array.isArray(response.data)) {
      console.warn("API returned non-array data for quizzes:", response.data);
      return [];
    }

    return response.data;

  } catch (error) {
    handleApiError(error);
    console.info("⚠️ Network error. Switching to DEMO MODE with mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_QUIZZES), 800));
  }
};

/**
 * NEW API: Get specific quiz with all questions
 */
export const fetchQuizDetail = async (
  quizId: string, 
  limit?: number
): Promise<QuizDetail> => {
  try {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`/quizzes/${quizId}${params}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.info("⚠️ Network error. Returning mock quiz detail.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_QUIZ_DETAIL), 800));
  }
};


/**
 * NEW API: Submit quiz attempt
 */
export const submitQuizAttempt = async (
  attempt: QuizAttemptPayload
): Promise<QuizAttemptResponse | null> => {
  try {
    const response = await apiClient.post<QuizAttemptResponse>('/quiz-attempts', attempt);
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.warn("⚠️ Failed to submit quiz attempt");
    return null;
  }
};

/**
 * NEW API: Get user's quiz history
 */
export const fetchUserQuizHistory = async (userId: string): Promise<UserQuizHistory[]> => {
  try {
    const response = await apiClient.get<UserQuizHistory[]>(`/users/${userId}/quiz-attempts`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

/**
 * NEW API: Get quiz statistics
 */
export const fetchQuizStatistics = async (): Promise<QuizStatistics[]> => {
  try {
    const response = await apiClient.get<QuizStatistics[]>('/quiz-statistics');
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

/**
 * EXISTING API: Fetch user info
 */
export const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {
      user_id: userId,
      name: "Demo Student",
      email: "student@edhub360.com"
    };
  }
};

/**
 * LEGACY SUPPORT: Convert new format to old format
 */
export const convertQuizDetailToLegacy = (detail: QuizDetail): Quiz => {
  const processedQuestions = processQuestions(detail.questions);

  return {
    quiz_id: detail.quiz_id,
    title: detail.title,
    description: detail.description,
    questions: processedQuestions.map(q => ({
      question: q.question,
      options: q.options,
      correct: q.correctIndex,
      explanation: q.explanation
    })),
    score: null,
    time_taken: null
  };
};

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.warn('API Connection Warning:', axiosError.message);
    if (axiosError.response) {
      console.warn('Response status:', axiosError.response.status);
      console.warn('Response data:', axiosError.response.data);
    }
  } else {
    console.error('Unexpected Error:', error);
  }
};

export default apiClient;
