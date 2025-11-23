// src/components/quiz/QuizPlayer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { QuizDetail, ProcessedQuestion, QuizResult, UserAnswer } from '../../types/quiz.types';
import { QuizButton } from './QuizButton';
import { QuizCard } from './QuizCard';
import { QUESTION_TIMER_SECONDS } from '../../constants/quiz.constants';

interface QuizPlayerProps {
  quiz: QuizDetail;  // Changed from Quiz
  questions: ProcessedQuestion[];  // ADDED - processed questions with shuffled options
  onComplete: (result: QuizResult, userAnswers: UserAnswer[]) => void;  // ADDED userAnswers
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, questions, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);  // NEW: Track user answers

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(QUESTION_TIMER_SECONDS);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      const result: QuizResult = {
        totalQuestions: questions.length,
        correctAnswers: score,
        scorePercentage: (score / questions.length) * 100,
        timeSpentSeconds,
      };
      onComplete(result, userAnswers);  // Pass userAnswers to parent
    }
  }, [currentQuestionIndex, questions.length, score, startTime, userAnswers, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, handleNext]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;  // Changed from currentQuestion.correct
    const selectedAnswer = currentQuestion.options[optionIndex];

    // Track this answer
    const answer: UserAnswer = {
      question_id: currentQuestion.question_id,
      user_answer: selectedAnswer,
      is_correct: isCorrect,
    };
    setUserAnswers((prev) => [...prev, answer]);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-gray-50 hover:bg-cyan-50 border-2 border-gray-200 hover:border-cyan-300 cursor-pointer';
    }

    if (index === currentQuestion.correctIndex) {  // Changed from currentQuestion.correct
      return 'bg-green-100 border-2 border-green-500';
    }

    if (index === selectedOption && index !== currentQuestion.correctIndex) {  // Changed
      return 'bg-red-100 border-2 border-red-500';
    }

    return 'bg-gray-50 border-2 border-gray-200 opacity-50';
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timerPercentage = (timeLeft / QUESTION_TIMER_SECONDS) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between text-gray-700">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Exit Quiz
        </button>
        <div className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="mb-4 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-cyan-500 h-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <QuizCard>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-red-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
            <span
              className={`font-mono text-lg font-bold ${
                timeLeft <= 5 ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${getOptionClass(
                index
              )}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-gray-700 border border-gray-300">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium text-gray-800">{option}</span>
                {isAnswered && index === currentQuestion.correctIndex && (
                  <span className="ml-auto text-green-600 font-bold">✓</span>
                )}
                {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                  <span className="ml-auto text-red-600 font-bold">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && selectedOption !== currentQuestion.correctIndex && currentQuestion.explanation && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="font-semibold text-blue-900 mb-1">Explanation:</p>
            <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <QuizButton onClick={handleNext} variant="primary" className="w-full" size="lg">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'} →
          </QuizButton>
        )}
      </QuizCard>
    </div>
  );
};
