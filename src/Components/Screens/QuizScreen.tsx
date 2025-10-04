import React from "react";
import { Brain, Check, X } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizScreenProps {
  quizStarted: boolean;
  quizQuestions: QuizQuestion[];
  currentQuestion: number;
  selectedAnswer: number | null;
  startQuiz: () => void;
  answerQuizQuestion: (index: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  quizStarted,
  quizQuestions,
  currentQuestion,
  selectedAnswer,
  startQuiz,
  answerQuizQuestion
}) => {
  return (
    <div className="p-6 space-y-6">
      {!quizStarted ? (
        <div className="space-y-6">
          {/* Welcome / Quiz Start Card */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Mode</h2>
            <p className="text-gray-600">Test your knowledge with adaptive questions</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to test yourself?</h3>
            <p className="text-gray-600 mb-8">This quiz contains {quizQuestions.length} questions covering various topics.</p>
            <button
              onClick={startQuiz}
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Start Quiz
            </button>
          </div>

          {/* Recent Scores & Quiz Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Scores */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Scores</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-900">Mathematics</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-900">Science</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-gray-900">History</span>
                  <span className="font-bold text-yellow-600">78%</span>
                </div>
              </div>
            </div>

            {/* Quiz Statistics */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quiz Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quizzes</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Subject</span>
                  <span className="font-semibold">Mathematics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Improvement</span>
                  <span className="font-semibold text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz In-Progress */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Question {currentQuestion + 1}</h2>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestion + 1} of {quizQuestions.length}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-8">
              {quizQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-4">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuizQuestion(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === null
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      : selectedAnswer === index
                      ? index === quizQuestions[currentQuestion].correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : index === quizQuestions[currentQuestion].correct
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {selectedAnswer !== null && (
                      <div>
                        {index === quizQuestions[currentQuestion].correct ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : selectedAnswer === index ? (
                          <X className="w-6 h-6 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-800 font-medium mb-2">Explanation:</p>
                <p className="text-blue-700">{quizQuestions[currentQuestion].explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
