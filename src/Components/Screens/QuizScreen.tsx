// src/components/screens/QuizScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  QuizListItem,
  QuizDetail,
  ProcessedQuestion,
  QuizResult,
  ViewState,
  UserAnswer
} from '../../types/quiz.types';
import {
  fetchQuizzes,
  fetchQuizDetail,
  processQuestions,
  submitQuizAttempt
} from '../../services/quizapi';
import { GRADIENT_BG } from '../../constants/quiz.constants';
import { useAuth } from '../../context/AuthContext';
import { QuizList } from '../Quiz/QuizList';
import { QuizPlayer } from '../Quiz/QuizPlayer';
import { QuizScoreScreen } from '../Quiz/QuizScoreScreen';
import { QuizButton } from '../Quiz/QuizButton';
import { Pagination } from '../common/Pagination';
const QuizScreen: React.FC = () => {
  // Get real logged-in user from auth context
  const { user } = useAuth();

  const [view, setView] = useState<ViewState>(ViewState.LOADING);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<QuizDetail | null>(null);
  const [processedQuestions, setProcessedQuestions] = useState<ProcessedQuestion[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  // Calculate total pages based on a total count from backend
  // For now, we'll estimate based on returned results
  const [totalPages, setTotalPages] = useState(1);

  // pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadQuizzes(page);
  }, [page]);

  const loadQuizzes = async (pageNum: number) => {
    setView(ViewState.LOADING);
    setError(null);
    try {
      // NEW: No user_id needed - fetches global quizzes
      const data = await fetchQuizzes(pageNum, pageSize);
      
      // Check if we are receiving the mock data
      if (Array.isArray(data) && data.length > 0 && data[0].quiz_id.startsWith('mock-')) {
        setIsDemoMode(true);
      } else {
        setIsDemoMode(false);
      }

      setQuizzes(data || []);

      // Estimate total pages (you'll need backend to return total count)
      // For now: if we get full page, assume there might be more
      if (data.length === pageSize) {
        setTotalPages(Math.max(totalPages, pageNum + 1));
      } else {
        setTotalPages(pageNum);
      }

      setView(ViewState.LIST);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes. Please ensure the backend is running.");
      setView(ViewState.ERROR);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    setView(ViewState.LOADING);
    try {
      // Fetch 5-10 random questions (you can make this configurable)
      const randomLimit = Math.floor(Math.random() * 6) + 5; // Random between 5-10
      const quiz = await fetchQuizDetail(quizId, randomLimit);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      
      if (!quiz.questions || quiz.questions.length === 0) {
        setError('This quiz has no questions available.');
        setView(ViewState.ERROR);
        return;
      }
      
      setActiveQuiz(quiz);
      const processed = processQuestions(quiz.questions);
      setProcessedQuestions(processed);
      setView(ViewState.PLAYING);
    } catch (err) {
      console.error(err);
      setError('Failed to load quiz. Please try again.');
      setView(ViewState.ERROR);
    }
  };

  const handleQuizComplete = async (
    result: QuizResult,
    userAnswers: UserAnswer[]
  ) => {
    if (!activeQuiz) return;

    // Submit quiz attempt to backend with real user_id from auth context
    // Extract user_id from auth context (the field name is 'id')
    const userId = user?.id;

    if (userId) {
      try {
        await submitQuizAttempt({
          user_id: userId, // Using real logged-in user's ID
          quiz_id: activeQuiz.quiz_id,
          score: result.correctAnswers,
          total_questions: result.totalQuestions,
          score_percentage: result.scorePercentage,
          time_taken: result.timeSpentSeconds,
          answers: userAnswers,
        });
        console.debug(`✅ Quiz attempt submitted for user: ${userId}`);
      } catch (err) {
        console.warn('⚠️ Failed to submit quiz attempt:', err);
        // Continue to show results even if submission fails
      }
    } else {
      console.debug('⚠️ No user logged in - skipping quiz analytics submission');
    }

    setLastResult(result);
    setView(ViewState.RESULT);
  };

  const handleRetry = async () => {
    if (activeQuiz) {
      // Re-shuffle questions for retry
      const processed = processQuestions(activeQuiz.questions);
      setProcessedQuestions(processed);
      setLastResult(null);
      setView(ViewState.PLAYING);
    }
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
    setProcessedQuestions([]);
    setLastResult(null);
    loadQuizzes(page);
  };

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    // disable Next when fewer than pageSize items returned
    if (quizzes.length < pageSize) return;
    setPage((p) => p + 1);
  };

  return (
    <div className={`min-h-screen ${GRADIENT_BG} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {isDemoMode && (
          <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-semibold">Demo Mode Active</p>
            <p className="text-sm">Using sample data. Backend connection unavailable.</p>
          </div>
        )}

        {view === ViewState.LOADING && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-700">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-xl font-semibold">Loading quizzes...</p>
            </div>
          </div>
        )}

        {view === ViewState.ERROR && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Quizzes</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => loadQuizzes(page)}
                className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {view === ViewState.LIST && (
          <>
            <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} />
            
            {/* NEW: Numbered Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        {view === ViewState.PLAYING && activeQuiz && processedQuestions.length > 0 && (
          <QuizPlayer
            quiz={activeQuiz}
            questions={processedQuestions}
            onComplete={handleQuizComplete}
            onExit={handleBackToList}
          />
        )}

        {view === ViewState.RESULT && lastResult && activeQuiz && (
          <QuizScoreScreen
            result={lastResult}
            quizTitle={activeQuiz.title}
            onRetry={handleRetry}
            onHome={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
