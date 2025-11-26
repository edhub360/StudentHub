//src/components/quiz/QuizList.tsx
import React from 'react';
import { QuizListItem } from '../../types/quiz.types';
import { QuizCard } from './QuizCard';
import { QuizButton } from './QuizButton';

interface QuizListProps {
  quizzes: QuizListItem[];  // Changed from Quiz[]
  onStartQuiz: (quizId: string) => void;  // Changed from (quiz: Quiz) => void
}

export const QuizList: React.FC<QuizListProps> = ({ quizzes, onStartQuiz }) => {
  return (
    <div className="max-w-4xl mx-auto">

      {quizzes.length === 0 ? (
        <QuizCard>
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-2">No quizzes found.</p>
            <p className="text-gray-400 text-sm">Check back later or contact your administrator.</p>
          </div>
        </QuizCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => {
            const questionCount = quiz.total_questions || 0;  // Changed from quiz.questions?.length

            return (
              <QuizCard key={quiz.quiz_id} className="hover:shadow-2xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {quiz.title || 'Untitled Quiz'}
                    </h3>
                    <p className="text-gray-600 text-sm font-normal mb-3">
                      {quiz.description || 'Test your knowledge with this curated set of questions.'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-normal">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">{questionCount}</span> Questions
                      </span>
                      {/* NEW: Show subject tag and difficulty */}
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {quiz.subject_tag}
                      </span>
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                        {quiz.difficulty_level}
                      </span>
                      {quiz.estimated_time && (
                        <span className="flex items-center gap-1">
                          ⏱️ <span className="font-medium">{quiz.estimated_time}</span> min
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <QuizButton
                  onClick={() => onStartQuiz(quiz.quiz_id)}  // Pass quiz_id instead of full quiz
                  variant="primary"
                  className="w-full"
                  disabled={questionCount === 0}
                >
                  Start Quiz →
                </QuizButton>
              </QuizCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
