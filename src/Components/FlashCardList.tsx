import React from 'react';
import { FlashcardRecord } from '../types';

interface Props {
  cards: FlashcardRecord[];
  loading: boolean;
  error?: string | null;
  onEdit: (card: FlashcardRecord) => void;
  onDelete: (id: string) => void;
}

export default function FlashcardList({ cards, loading, error, onEdit, onDelete }: Props) {
  if (loading) return <div className="info">Loading flashcards...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!cards || cards.length === 0) return <div className="info">No flashcards found.</div>;

  return (
    <div className="card-list">
      {cards.map((c) => {
        const id = c.card_id || c.id || c._id || '(no-id)';
        return (
          <div key={id} className="card">
            <div className="card-body">
              <strong>ID:</strong> <span className="muted">{id}</span>
              <pre className="card-json">{JSON.stringify(c, null, 2)}</pre>
            </div>
            <div className="card-actions">
              <button className="btn" onClick={() => onEdit(c)}>Edit</button>
              <button className="btn danger" onClick={() => onDelete(id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
