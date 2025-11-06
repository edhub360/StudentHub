import { FlashcardRecord } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Helper to parse response and throw on non-OK.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = (data && (data.detail || data.error)) || res.statusText || 'API error';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data as T;
}

export async function listFlashcards(): Promise<FlashcardRecord[]> {
  const res = await fetch(`${API_BASE}/flashcards`);
  return handleResponse<FlashcardRecord[]>(res);
}

export async function getFlashcard(id: string): Promise<FlashcardRecord> {
  const res = await fetch(`${API_BASE}/flashcards/${encodeURIComponent(id)}`);
  return handleResponse<FlashcardRecord>(res);
}

export async function createFlashcard(payload: Partial<FlashcardRecord>): Promise<FlashcardRecord> {
  const res = await fetch(`${API_BASE}/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<FlashcardRecord>(res);
}

export async function updateFlashcard(id: string, payload: Partial<FlashcardRecord>): Promise<FlashcardRecord> {
  const res = await fetch(`${API_BASE}/flashcards/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<FlashcardRecord>(res);
}

export async function deleteFlashcard(id: string): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE}/flashcards/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message?: string }>(res);
}
