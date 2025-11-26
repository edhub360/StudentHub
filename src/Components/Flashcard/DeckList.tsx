import React from 'react';
import { FlashcardDeck } from '../../types/flashcard.types';
import { Card } from './Card';
import { Button } from './Button';
import { DIFFICULTY_COLORS } from '../../constants/flashcard.constants';
import { BookOpen, Tag } from 'lucide-react';

interface DeckListProps {
  decks: FlashcardDeck[];
  onSelectDeck: (deckId: string) => void;
}

export const DeckList: React.FC<DeckListProps> = ({ decks, onSelectDeck }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Flashcards</h1>
        <p className="text-gray-600">Choose a topic to start mastering your skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck.deck_id} hoverEffect className="flex flex-col h-full border-t-4 border-t-cyan-500">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${DIFFICULTY_COLORS[deck.difficulty_level] || 'bg-gray-100 text-gray-800'}`}>
                {deck.difficulty_level}
              </span>
              <span className="flex items-center text-gray-500 text-sm">
                <BookOpen size={16} className="mr-1" />
                {deck.total_cards} cards
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{deck.title}</h3>
            <p className="text-gray-600 mb-6 flex-grow line-clamp-2">{deck.description}</p>

            <div className="flex items-center text-sm text-cyan-600 font-medium mb-6 bg-cyan-50 w-fit px-3 py-1 rounded-full">
              <Tag size={14} className="mr-1" />
              {deck.subject_tag}
            </div>

            <Button onClick={() => onSelectDeck(deck.deck_id)} variant="gradient" fullWidth>
              Start Studying
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};