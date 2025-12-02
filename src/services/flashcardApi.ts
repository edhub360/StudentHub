import axios from 'axios';
import { API_BASE_URL } from '../constants/flashcard.constants';
import { FlashcardDeck, FlashcardDeckDetail, FlashcardAnalyticsPayload } from '../types/flashcard.types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Mock Data for fallback
const MOCK_DECKS: FlashcardDeck[] = [
  {
    deck_id: "1",
    title: "React Fundamentals",
    description: "Master React basics, hooks, and component lifecycle.",
    subject_tag: "Programming",
    difficulty_level: "Easy",
    is_active: true,
    total_cards: 5
  },
  {
    deck_id: "2",
    title: "Advanced TypeScript",
    description: "Deep dive into generics, utility types, and strict mode.",
    subject_tag: "Programming",
    difficulty_level: "Hard",
    is_active: true,
    total_cards: 8
  },
  {
    deck_id: "3",
    title: "European History",
    description: "Key events from the Renaissance to modern day.",
    subject_tag: "History",
    difficulty_level: "Medium",
    is_active: true,
    total_cards: 12
  }
];

const MOCK_DECK_DETAILS: Record<string, FlashcardDeckDetail> = {
  "1": {
    deck_id: "1",
    title: "React Fundamentals",
    description: "Master React basics",
    subject_tag: "Programming",
    difficulty_level: "Easy",
    cards: [
      {
        card_id: "c1",
        front_text: "What is JSX?",
        back_text: "JavaScript XML - a syntax extension for JavaScript that looks like HTML.",
        hint: "It allows you to write HTML-like structures in JS files."
      },
      {
        card_id: "c2",
        front_text: "What is the Virtual DOM?",
        back_text: "A lightweight copy of the real DOM in memory. React uses it to calculate the most efficient way to update the browser's DOM.",
        hint: "It is a performance optimization technique."
      },
      {
        card_id: "c3",
        front_text: "What hook is used for side effects?",
        back_text: "useEffect",
        hint: "Starts with 'use' and handles lifecycle events."
      },
      {
        card_id: "c4",
        front_text: "How do you pass data from parent to child?",
        back_text: "Props (Properties).",
        hint: "It is a read-only object passed to components."
      },
      {
        card_id: "c5",
        front_text: "What is State?",
        back_text: "An object that determines how that component renders & behaves. It creates data that can be changed over time.",
      }
    ]
  },
  "2": {
    deck_id: "2",
    title: "Advanced TypeScript",
    description: "Deep dive into generics...",
    subject_tag: "Programming",
    difficulty_level: "Hard",
    cards: [
      {
        card_id: "t1",
        front_text: "What is the 'Partial' utility type?",
        back_text: "Constructs a type with all properties of Type set to optional.",
        hint: "It makes everything optional."
      }
    ]
  }
};

export const fetchDecks = async (): Promise<FlashcardDeck[]> => {
  try {
    const response = await api.get('/flashcard-decks');
    return response.data;
  } catch (error) {
    console.warn("API Error, using mock data for Decks:", error);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DECKS;
  }
};

export const fetchDeckDetail = async (deckId: string): Promise<FlashcardDeckDetail> => {
  try {
    const response = await api.get(`/flashcard-decks/${deckId}`);
    return response.data;
  } catch (error) {
    console.warn(`API Error for deck ${deckId}, using mock data:`, error);
    await new Promise(resolve => setTimeout(resolve, 600));
    const deck = MOCK_DECK_DETAILS[deckId];
    if (deck) return deck;
    // Fallback for ID not in mock
    return {
      ...MOCK_DECKS[0],
      cards: MOCK_DECK_DETAILS["1"].cards
    };
  }
};

/**
 * Sends flashcard analytics data to the backend.
 * Uses fire-and-forget pattern.
 */
export const logFlashcardAttempt = async (payload: FlashcardAnalyticsPayload): Promise<void> => {
  try {
    // The endpoint expects: deck_id, user_id, card_reviewed, time_taken
    await api.post('/flashcard-analytics', payload);
    console.debug(`✅ Flashcard analytics sent for user: ${payload.user_id}, Deck: ${payload.deck_id}, Time: ${payload.time_taken}s`);
  } catch (error) {
    // Silently fail for analytics to not disrupt user experience
    console.warn("Failed to send flashcard analytics:", error);
  }
};