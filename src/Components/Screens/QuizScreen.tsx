import React, { useState, useEffect } from 'react';
import { Quiz, QuizResult, ViewState } from '../../types/quiz.types';
import { fetchQuizzes } from '../../services/quizapi';
import { TEST_USER_ID, GRADIENT_BG } from '../../constants/quiz.constants';
import { QuizList } from '../Quiz/QuizList';
import { QuizPlayer } from '../Quiz/QuizPlayer';
import { QuizScoreScreen } from '../Quiz/QuizScoreScreen';


const QuizScreen: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOADING);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);


  useEffect(() => {
    loadQuizzes();
  }, []);


  const loadQuizzes = async () => {
    setView(ViewState.LOADING);
    setError(null);
    try {
      // Using the TEST_USER_ID from constants to simulate logged-in user context
      const data = await fetchQuizzes(TEST_USER_ID);
      
      // Check if we are receiving the mock data by ID convention (simple check for demo purposes)
      // Ensure data is an array before checking properties
      if (Array.isArray(data) && data.length > 0 && data[0].quiz_id.startsWith('mock-')) {
        setIsDemoMode(true);
      } else {
        setIsDemoMode(false);
      }


      setQuizzes(data || []);
      setView(ViewState.LIST);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes. Please ensure the backend is running.");
      setView(ViewState.ERROR);
    }
  };


  const handleStartQuiz = (quiz: Quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      setError('This quiz has no questions available.');
      return;
    }
    setActiveQuiz(quiz);
    setView(ViewState.PLAYING);
  };


  const handleQuizComplete = (result: QuizResult) => {
    setLastResult(result);
    setView(ViewState.RESULT);
  };


  const handleRetry = () => {
    if (activeQuiz) {
      setView(ViewState.PLAYING);
    }
  };


  const handleBackToList = () => {
    setActiveQuiz(null);
    setLastResult(null);
    loadQuizzes();
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
                onClick={loadQuizzes}
                className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}


        {view === ViewState.LIST && (
          <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} />
        )}


        {view === ViewState.PLAYING && activeQuiz && (
          <QuizPlayer
            quiz={activeQuiz}
            onComplete={handleQuizComplete}
            onExit={handleBackToList}
          />
        )}


        {view === ViewState.RESULT && lastResult && (
          <QuizScoreScreen
            result={lastResult}
            onRetry={handleRetry}
            onHome={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};


export default QuizScreen;
