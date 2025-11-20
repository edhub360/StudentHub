import axios, { AxiosError } from 'axios';
import { Quiz, QuizQuestionItem, User } from '../types/quiz.types';
import { API_BASE_URL } from '../constants/quiz.constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Mock data for demo/offline mode
const MOCK_QUIZZES: Quiz[] = [
  {
    quiz_id: 'mock-quiz-001',
    user_id: 'demo-user',
    score: 85,
    time_taken: 120,
    questions: [
      {
        question: "What is the primary purpose of the useEffect hook in React?",
        options: [
          "To handle component styling",
          "To manage side effects like data fetching",
          "To create global state",
          "To optimize rendering performance"
        ],
        correct: 1,
        explanation: "useEffect is specifically designed to handle side effects (fetching data, subscriptions, manual DOM changes) in functional components."
      },
      {
        question: "Which CSS utility class would you use in Tailwind to make text bold?",
        options: ["font-heavy", "font-bold", "text-bold", "bold"],
        correct: 1,
        explanation: "Tailwind CSS uses 'font-bold' to apply bold font weight."
      },
      {
        question: "What does API stand for?",
        options: [
          "Application Programming Interface",
          "Advanced Programming Integration",
          "Application Process Integration",
          "Advanced Protocol Interface"
        ],
        correct: 0,
        explanation: "API stands for Application Programming Interface, which allows different software applications to communicate with each other."
      }
    ]
  }
];

/**
 * HELPER: Shuffle array in place (Fisher-Yates algorithm)
 * Used to randomize option order so the correct answer isn't always last.
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
 * DATA NORMALIZATION
 * Transforms various DB formats into the strict QuizQuestionItem interface expected by the UI.
 * Handles:
 * 1. "question_text" vs "question"
 * 2. "correct_answer" + "incorrect_answers" (DB format) vs "options" + "correct" (UI format)
 */
const normalizeQuestions = (rawQuestions: any[]): QuizQuestionItem[] => {
  if (!Array.isArray(rawQuestions)) return [];

  return rawQuestions.map((q: any, idx: number) => {
    // 1. Resolve Question Text
    const questionText = q.question || q.question_text || `Question ${idx + 1}`;

    // 2. Resolve Options & Correct Index
    let options: string[] = [];
    let correctIndex = 0;

    // CASE A: Data has "correct_answer" and "incorrect_answers" (Format from your screenshot)
    if (q.correct_answer || q.incorrect_answers) {
      const incorrect = Array.isArray(q.incorrect_answers) 
        ? q.incorrect_answers 
        : (typeof q.incorrect_answers === 'string' ? JSON.parse(q.incorrect_answers) : []); // Handle stringified JSON if necessary
      
      const correct = q.correct_answer || "Missing Answer";

      // Combine and Shuffle
      const allOptions = [...incorrect, correct];
      options = shuffleArray(allOptions);
      
      // Find where the correct answer ended up
      correctIndex = options.indexOf(correct);
      if (correctIndex === -1) correctIndex = 0; // Fallback
    }
    // CASE B: Data already has "options" list (Legacy/Mock format)
    else if (Array.isArray(q.options)) {
      options = q.options;
      correctIndex = typeof q.correct === 'number' ? q.correct : 0;
    }

    return {
      question: questionText,
      options: options,
      correct: correctIndex,
      explanation: q.explanation || "No explanation provided."
    };
  });
};

export const fetchQuizzes = async (userId?: string): Promise<Quiz[]> => {
  try {
    const params = userId ? { user_id: userId } : {};
    // Use type 'any' first to allow inspection of raw unknown structure
    const response = await apiClient.get<any[]>('/quizzes', { params });
    
    let rawData = response.data;

    // Robust check for array
    if (!Array.isArray(rawData)) {
      console.warn("API returned non-array data for quizzes:", rawData);
      return []; 
    }

    // Normalize every quiz and its questions
    const normalizedQuizzes: Quiz[] = rawData.map((quizRaw: any) => {
      return {
        ...quizRaw,
        // If questions exists, run it through normalization
        questions: quizRaw.questions ? normalizeQuestions(quizRaw.questions) : []
      };
    });

    return normalizedQuizzes;

  } catch (error) {
    handleApiError(error);
    console.info("⚠️ Network error or Parse error. Switching to DEMO MODE with mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_QUIZZES), 800));
  }
};

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

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.warn('API Connection Warning:', axiosError.message);
  } else {
    console.error('Unexpected Error:', error);
  }
};

export default apiClient;
