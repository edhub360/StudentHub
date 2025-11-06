import React, { useEffect, useState } from 'react';
import { FlashcardRecord } from '../types';

interface Props {
  initial?: FlashcardRecord | null;
  onSubmit: (payload: FlashcardRecord) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

/**
 * Simple JSON-based form to stay schema-flexible for the backend.
 */
export default function FlashcardForm({ initial, onSubmit, onCancel, submitLabel }: Props) {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setText(initial ? JSON.stringify(initial, null, 2) : '');
    setError(null);
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = text ? JSON.parse(text) : {};
      setError(null);
      await onSubmit(parsed as FlashcardRecord);
    } catch (err: any) {
      setError('Invalid JSON: ' + (err?.message ?? String(err)));
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="label">Flashcard JSON</label>
      <textarea
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder='Example: {"cards":[{"front":"Q?","back":"A."}],"user_id":"user-uuid"}'
      />
      {error && <div className="error">{error}</div>}
      <div className="form-actions">
        <button className="btn primary" type="submit">{submitLabel || 'Save'}</button>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
