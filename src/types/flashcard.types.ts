export enum ViewState {
  LIST = 'LIST',
  PLAYING = 'PLAYING',
  COMPLETE = 'COMPLETE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface FlashcardDeck {
  deck_id: string;
  title: string;
  description: string;
  subject_tag: string;
  difficulty_level: string;
  is_active: boolean;
  total_cards: number;
}

export interface FlashcardItem {
  card_id: string;
  front_text: string;
  back_text: string;
  hint?: string;
}

export interface FlashcardDeckDetail {
  deck_id: string;
  title: string;
  description: string;
  subject_tag: string;
  difficulty_level: string;
  cards: FlashcardItem[];
}
