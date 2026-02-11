// src/Components/Screens/FlashcardScreen.tsx
import React, { useState, useEffect } from 'react';
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
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state for deck list
  const [deckOffset, setDeckOffset] = useState(0);
  const [hasMoreDecks, setHasMoreDecks] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial Data Load
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async (offset: number = 0) => {
    if (offset === 0) {
      setViewState(ViewState.LOADING);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await fetchDecks(offset, 6);
      
      if (offset === 0) {
        setDecks(response.decks);
      } else {
        setDecks(prev => [...prev, ...response.decks]);
      }
      
      setDeckOffset(response.pagination.offset + response.pagination.limit);
      setHasMoreDecks(response.pagination.has_more);
      setViewState(ViewState.LIST);
    } catch (err) {
      setError("Failed to load flashcard decks.");
      setViewState(ViewState.ERROR);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMoreDecks = () => {
    loadDecks(deckOffset);
  };

  const handleSelectDeck = async (deckId: string) => {
    setViewState(ViewState.LOADING);
    try {
      const detail = await fetchDeckDetail(deckId, 0, 50); // Load first 50 cards
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  if (viewState === ViewState.ERROR) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error || "An unexpected error occurred."}</p>
        <Button onClick={() => loadDecks(0)} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  if (viewState === ViewState.PLAYING && selectedDeck) {
    return (
      <FlashcardPlayer
        deck={selectedDeck}
        onComplete={handleDeckComplete}
        onExit={handleExit}
      />
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

  // Default: LIST with pagination
  return (
    <div className="container mx-auto px-4 py-8">
      <DeckList decks={decks} onSelectDeck={handleSelectDeck} />
      
      {/* Load More Button */}
      {hasMoreDecks && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMoreDecks}
            variant="secondary"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More Decks'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
