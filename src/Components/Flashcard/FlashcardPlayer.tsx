import React, { useState, useEffect } from 'react';
import { FlashcardDeckDetail } from '../../types/flashcard.types';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowLeft, Lightbulb, RotateCcw } from 'lucide-react';

interface FlashcardPlayerProps {
  deck: FlashcardDeckDetail;
  onComplete: () => void;
  onExit: () => void;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ deck, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [animationClass, setAnimationClass] = useState('opacity-100');

  const currentCard = deck.cards[currentIndex];

  // Reset state when deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [deck.deck_id]);

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setAnimationClass('opacity-0 translate-x-4');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setAnimationClass('opacity-0 -translate-x-4');
        setTimeout(() => setAnimationClass('opacity-100 translate-x-0'), 50);
      }, 200);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setAnimationClass('opacity-0 -translate-x-4');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setShowAnswer(false);
        setAnimationClass('opacity-0 translate-x-4');
        setTimeout(() => setAnimationClass('opacity-100 translate-x-0'), 50);
      }, 200);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showAnswer) {
        e.preventDefault();
        handleShowAnswer();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, currentIndex]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col h-screen max-h-[850px]">
      {/* Header */}
      <div className="text-center mb-6 relative">
        <button 
          onClick={onExit}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
          aria-label="Exit"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-500 text-sm">Test your knowledge with AI-generated cards</p>
      </div>

      {/* Main Flashcard Area */}
      <div className="flex-grow flex flex-col relative">
        <Card className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 transition-all duration-300 transform ${animationClass}`}>
          
          {/* Subject Tag */}
          <div className="absolute top-8">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">
              {deck.subject_tag || 'General'}
            </span>
          </div>

          {/* Question Section */}
          <div className="text-center w-full max-w-2xl mt-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {currentCard.front_text}
            </h2>
          </div>

          {/* Show Answer Button - Clean Outline Style */}
          {!showAnswer && (
            <button 
              onClick={handleShowAnswer}
              className="mt-4 px-8 py-2.5 rounded-lg border border-cyan-500 text-cyan-600 font-medium hover:bg-cyan-50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Show Answer
            </button>
          )}

          {/* Answer Section */}
          {showAnswer && (
            <div className="text-center w-full max-w-2xl animate-fade-in flex flex-col items-center">
              <div className="w-16 h-1 bg-gray-100 mb-6 rounded-full"></div>
              <div className="text-xl md:text-2xl text-gray-700 font-medium mb-6">
                {currentCard.back_text}
              </div>
              
              {currentCard.hint && (
                <div className="inline-flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Lightbulb size={14} className="mr-2 text-yellow-500" />
                  <span>{currentCard.hint}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-8 px-2">
        <span className="text-gray-500 font-medium">
          Card {currentIndex + 1} of {deck.cards.length}
        </span>

        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Previous Question"
          >
            <RotateCcw size={20} />
          </button>

          {/* Next Card Button */}
          <Button 
            onClick={handleNext}
            className="px-8 min-w-[140px]"
          >
            {currentIndex === deck.cards.length - 1 ? 'Finish' : 'Next Card'}
          </Button>
        </div>
      </div>
    </div>
  );
};