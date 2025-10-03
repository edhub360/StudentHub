// FlashCardsScreen.tsx
import React from "react";
import { RotateCcw, ChevronRight } from "lucide-react";

interface FlashCard {
  subject: string;
  front: string;
  back: string;
  mastered?: boolean;
}

interface FlashCardsScreenProps {
  flashCards: FlashCard[];
  currentFlashCard: number;
  showFlashCardBack: boolean;
  setShowFlashCardBack: React.Dispatch<React.SetStateAction<boolean>>;
  nextFlashCard: () => void;
}

const FlashCardsScreen: React.FC<FlashCardsScreenProps> = ({
  flashCards,
  currentFlashCard,
  showFlashCardBack,
  setShowFlashCardBack,
  nextFlashCard,
}) => {
  // Count cards by status
  const masteredCount = flashCards.filter(card => card.mastered).length;
  const learningCount = flashCards.filter(card => !card.mastered && card.front).length;
  const newCount = flashCards.length - masteredCount - learningCount;

  // Unique subjects for study sets
  const subjects = Array.from(new Set(flashCards.map(card => card.subject)));

  return (
    <div className="p-6 space-y-6">
      {/* Flashcard Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h2>
        <p className="text-gray-600">Test your knowledge with AI-generated cards</p>
      </div>

      {/* Flashcard Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-80">
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
            {flashCards[currentFlashCard].subject}
          </span>
        </div>

        <div className="flex items-center justify-center min-h-40 mb-8">
          <div className="text-center max-w-md">
            <p className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
              {showFlashCardBack
                ? flashCards[currentFlashCard].back
                : flashCards[currentFlashCard].front}
            </p>
            {!showFlashCardBack && (
              <button
                onClick={() => setShowFlashCardBack(true)}
                className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-300 rounded-lg transition-colors"
              >
                Show Answer
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Card {currentFlashCard + 1} of {flashCards.length}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFlashCardBack(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={nextFlashCard}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Next Card
            </button>
          </div>
        </div>
      </div>

      {/* Progress + Study Sets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mastered Cards</span>
              <span className="font-medium">{masteredCount}/{flashCards.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(masteredCount / flashCards.length) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{masteredCount}</p>
                <p className="text-xs text-gray-500">Mastered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{learningCount}</p>
                <p className="text-xs text-gray-500">Learning</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{newCount}</p>
                <p className="text-xs text-gray-500">New</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Sets */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Study Sets</h3>
          <div className="space-y-3">
            {subjects.map((subj, idx) => {
              const count = flashCards.filter(card => card.subject === subj).length;
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{subj}</p>
                    <p className="text-sm text-gray-600">{count} cards</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardsScreen;
