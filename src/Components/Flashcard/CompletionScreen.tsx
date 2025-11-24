import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { CheckCircle, Clock, RotateCcw, LayoutGrid } from 'lucide-react';

interface CompletionScreenProps {
  deckTitle: string;
  totalCards: number;
  timeSpentSeconds: number;
  onRetry: () => void;
  onBack: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  deckTitle,
  totalCards,
  timeSpentSeconds,
  onRetry,
  onBack
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4 bg-gradient-to-br from-cyan-50 to-gray-100">
      <Card className="max-w-lg w-full text-center py-10 px-8 border-t-8 border-t-cyan-500">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Great Job!</h2>
        <p className="text-gray-600 mb-8">
          You've completed the <span className="font-bold text-cyan-600">"{deckTitle}"</span> deck.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Cards Reviewed</span>
              <span className="text-3xl font-bold text-gray-800">{totalCards}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Time Spent</span>
              <div className="flex items-center text-3xl font-bold text-gray-800">
                <Clock size={20} className="mr-2 text-cyan-500" />
                {formatTime(timeSpentSeconds)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onRetry} fullWidth className="flex items-center justify-center">
            <RotateCcw size={18} className="mr-2" />
            Study Again
          </Button>
          <Button onClick={onBack} variant="outline" fullWidth className="flex items-center justify-center">
            <LayoutGrid size={18} className="mr-2" />
            Back to Decks
          </Button>
        </div>
      </Card>
    </div>
  );
};