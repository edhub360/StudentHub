import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { QuizResult } from '../../types/quiz.types';
import { QuizCard } from './QuizCard';
import { QuizButton } from './QuizButton';

interface ScoreScreenProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

export const QuizScoreScreen: React.FC<ScoreScreenProps> = ({ result, onRetry, onHome }) => {
  const data = [
    { name: 'Correct', value: result.correctAnswers },
    { name: 'Incorrect', value: result.totalQuestions - result.correctAnswers },
  ];

  const COLORS = ['#06b6d4', '#ef4444']; // Cyan-500, Red-500

  const getMessage = (score: number) => {
    if (score === 100) return "Perfect Score! 🏆";
    if (score >= 80) return "Excellent Work! 🌟";
    if (score >= 60) return "Good Job! 👍";
    return "Keep Practicing! 💪";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <QuizCard>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 font-normal">{getMessage(result.scorePercentage)}</p>
        </div>

        <div className="mb-8">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const percentage = ((entry.value / result.totalQuestions) * 100).toFixed(0);
                  return `${entry.name}: ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-cyan-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-normal">Score</p>
            <p className="text-2xl font-semibold text-cyan-600">
              {Math.round(result.scorePercentage)}%
            </p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-normal">Correct</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-normal">Time</p>
            <p className="text-2xl font-semibold text-blue-600">{result.timeSpentSeconds}s</p>
          </div>
        </div>

        <div className="flex gap-4">
          <QuizButton onClick={onRetry} variant="secondary" className="flex-1" size="lg">
            Retry Quiz
          </QuizButton>
          <QuizButton onClick={onHome} variant="primary" className="flex-1" size="lg">
            Back to List
          </QuizButton>
        </div>
      </QuizCard>
    </div>
  );
};
