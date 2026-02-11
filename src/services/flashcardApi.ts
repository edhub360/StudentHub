// src/services/flashcardApi.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants/flashcard.constants';
import { FlashcardDeck, FlashcardDeckDetail, FlashcardAnalyticsPayload } from '../types/flashcard.types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// ========== PAGINATION TYPES ==========
interface PaginationMeta {
  total: number;
  offset: number;
  limit: number;
  has_more: boolean;
}

interface DecksResponse {
  decks: FlashcardDeck[];
  pagination: PaginationMeta;
}

interface DeckDetailResponse extends FlashcardDeckDetail {
  pagination: PaginationMeta;
}

// ========== API FUNCTIONS WITH PAGINATION ==========

/**
 * Fetch paginated flashcard decks
 * offset - Number of decks to skip (default: 0)
 * limit - Number of decks to return (default: 10)
 */

export const fetchDecks = async (offset: number = 0, limit: number = 10): Promise<DecksResponse> => {
  try {
    const response = await api.get('/flashcard-decks', {
      params: { offset, limit }
    });
    
    const data = response.data;
    
    // ✅ Handle both old (array) and new (object with pagination) formats
    if (Array.isArray(data)) {
      // Old format - wrap it
      return {
        decks: data,
        pagination: {
          total: data.length,
          offset: 0,
          limit: data.length,
          has_more: false
        }
      };
    }
    
    // New paginated format
    return data;
    
  } catch (error) {
    console.warn("API Error, using mock data for Decks:", error);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      decks: MOCK_DECKS.slice(offset, offset + limit),
      pagination: {
        total: MOCK_DECKS.length,
        offset,
        limit,
        has_more: (offset + limit) < MOCK_DECKS.length
      }
    };
  }
};

/**
 * Fetch flashcard deck detail with paginated cards
 */
export const fetchDeckDetail = async (
  deckId: string, 
  offset: number = 0, 
  limit: number = 20
): Promise<DeckDetailResponse> => {
  try {
    const response = await api.get(`/flashcard-decks/${deckId}`, {
      params: { offset, limit }
    });
    
    const data = response.data;
    
    // ✅ Handle both old and new formats
    if (!data.pagination) {
      // Old format - add pagination metadata
      return {
        ...data,
        pagination: {
          total: data.cards?.length || 0,
          offset: 0,
          limit: data.cards?.length || 0,
          has_more: false
        }
      };
    }
    
    // New paginated format
    return data;
    
  } catch (error) {
    console.warn(`API Error for deck ${deckId}, using mock data:`, error);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const deck = MOCK_DECK_DETAILS[deckId];
    if (deck) {
      const cards = deck.cards.slice(offset, offset + limit);
      return {
        ...deck,
        cards,
        pagination: {
          total: deck.cards.length,
          offset,
          limit,
          has_more: (offset + limit) < deck.cards.length
        }
      };
    }
    
    const fallbackDeck = MOCK_DECK_DETAILS["1"];
    const fallbackCards = fallbackDeck.cards.slice(offset, offset + limit);
    return {
      ...MOCK_DECKS[0],
      cards: fallbackCards,
      pagination: {
        total: fallbackDeck.cards.length,
        offset,
        limit,
        has_more: (offset + limit) < fallbackDeck.cards.length
      }
    };
  }
};


/**
 * Sends flashcard analytics data to the backend.
 * Uses fire-and-forget pattern.
 */
export const logFlashcardAttempt = async (payload: FlashcardAnalyticsPayload): Promise<void> => {
  try {
    await api.post('/flashcard-analytics', payload);
    console.debug(`✅ Flashcard analytics sent for user: ${payload.user_id}, Deck: ${payload.deck_id}, Time: ${payload.time_taken}s`);
  } catch (error) {
    console.warn("Failed to send flashcard analytics:", error);
  }
};

// ========== MOCK DATA (unchanged) ==========
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
        back_text: "An object that determines how that component renders & behaves. It creates data that can be changed over time."
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
        front_text: "What is the 'Partial<T>' utility type?",
        back_text: "Constructs a type with all properties of Type set to optional.",
        hint: "It makes everything optional."
      }
    ]
  }
};
