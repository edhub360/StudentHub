import React, { useState, useEffect, useRef } from 'react';
import { ViewState, FlashcardDeck, FlashcardDeckDetail } from '../../types/flashcard.types';
import { fetchDecks, fetchDeckDetail } from '../../services/flashcardApi';
import { DeckList } from '../Flashcard/DeckList';
import { FlashcardPlayer } from '../Flashcard/FlashcardPlayer';
import { CompletionScreen } from '../Flashcard/CompletionScreen';
import { Button } from '../Flashcard/Button';
import { AlertCircle, Loader2 } from 'lucide-react';

export const FlashcardScreen: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOADING);
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeckDetail | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    setViewState(ViewState.LOADING);
    try {
      const data = await fetchDecks();
      setDecks(data);
      setViewState(ViewState.LIST);
    } catch (err) {
      setError("Failed to load flashcard decks.");
      setViewState(ViewState.ERROR);
    }
  };

  const handleSelectDeck = async (deckId: string) => {
    setViewState(ViewState.LOADING);
    try {
      const detail = await fetchDeckDetail(deckId);
      setSelectedDeck(detail);
      setStartTime(Date.now());
      setViewState(ViewState.PLAYING);
    } catch (err) {
      setError("Failed to load deck contents.");
      setViewState(ViewState.ERROR);
    }
  };

  const handleDeckComplete = () => {
    setEndTime(Date.now());
    setViewState(ViewState.COMPLETE);
  };

  const handleRetry = () => {
    if (selectedDeck) {
      setStartTime(Date.now());
      setViewState(ViewState.PLAYING);
    }
  };

  const handleExit = () => {
    setSelectedDeck(null);
    setViewState(ViewState.LIST);
  };

  // Render Logic
  if (viewState === ViewState.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (viewState === ViewState.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "An unexpected error occurred."}</p>
          <Button onClick={loadDecks}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (viewState === ViewState.PLAYING && selectedDeck) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FlashcardPlayer 
          deck={selectedDeck}
          onComplete={handleDeckComplete}
          onExit={handleExit}
        />
      </div>
    );
  }

  if (viewState === ViewState.COMPLETE && selectedDeck) {
    const timeSpent = Math.max(0, Math.floor((endTime - startTime) / 1000));
    return (
      <CompletionScreen 
        deckTitle={selectedDeck.title}
        totalCards={selectedDeck.cards.length}
        timeSpentSeconds={timeSpent}
        onRetry={handleRetry}
        onBack={handleExit}
      />
    );
  }

  // Default: LIST
  return (
    <div className="min-h-screen bg-gray-50">
      <DeckList decks={decks} onSelectDeck={handleSelectDeck} />
    </div>
  );
};