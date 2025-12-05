import { NOTES_API_BASE_URL } from '../constants/notebook.contants';
import { Notebook, NotebookSource, ChatRequestDto, ChatResponseDto, ChatMessageDto } from '../types/notebook.types';
import { getValidAccessToken } from '../services/TokenManager';

// --- API CLIENT ---

// Helper to get headers
const getHeaders = async (isJson = true) => {
  const token = await getValidAccessToken();
  
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
  };
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Helper for handling fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.detail || errorMessage;
    } catch (e) {
      // ignore json parse error if body is empty or not json
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Attempt to parse JSON
  try {
    return await response.json();
  } catch (e) {
    // If successful response but not JSON (and not 204), return null or text
    return null;
  }
};

export const fetchNotebooks = async (): Promise<Notebook[]> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/notebooks/`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

export const createNotebook = async (title: string, description?: string): Promise<Notebook> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/notebooks/`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(response);
};

export const updateNotebook = async (notebookId: string, updates: { title?: string, description?: string }): Promise<Notebook> => {
  const headers = await getHeaders();
  // Use PATCH for partial updates
  const response = await fetch(`${NOTES_API_BASE_URL}/notebooks/${notebookId}`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteNotebook = async (notebookId: string): Promise<void> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/notebooks/${notebookId}`, {
    method: 'DELETE',
    headers: headers,
  });
  await handleResponse(response);
};

export const uploadSourceFile = async (notebookId: string, file: File, metadata: any = {}) => {
  const formData = new FormData();
  formData.append('notebook_id', notebookId);
  formData.append('type', 'file');
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));

  // getHeaders(false) skips Content-Type so browser sets boundary for FormData
  const headers = await getHeaders(false);
  const response = await fetch(`${NOTES_API_BASE_URL}/sources/`, {
    method: 'POST',
    headers: headers,
    body: formData,
  });
  return handleResponse(response);
};

export const addSourceUrl = async (
  notebookId: string, 
  type: 'website' | 'youtube', 
  url: string, 
  metadata: any = {}
) => {
  const formData = new FormData();
  formData.append('notebook_id', notebookId);
  formData.append('type', type);
  if (type === 'website') formData.append('website_url', url);
  if (type === 'youtube') formData.append('youtube_url', url);
  formData.append('metadata', JSON.stringify(metadata));

  const headers = await getHeaders(false);
  const response = await fetch(`${NOTES_API_BASE_URL}/sources/`, {
    method: 'POST',
    headers: headers,
    body: formData,
  });
  return handleResponse(response);
};

export const fetchNotebookSources = async (notebookId: string): Promise<{ sources: NotebookSource[], count: number }> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/sources/${notebookId}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

export const sendNotebookChat = async (notebookId: string, payload: ChatRequestDto): Promise<ChatResponseDto> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/chat/${notebookId}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const fetchNotebookChatHistory = async (notebookId: string): Promise<ChatMessageDto[]> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/chat/${notebookId}/history`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

export const clearNotebookChatHistory = async (notebookId: string): Promise<any> => {
  const headers = await getHeaders();
  const response = await fetch(`${NOTES_API_BASE_URL}/chat/${notebookId}/history`, {
    method: 'DELETE',
    headers: headers,
  });
  return handleResponse(response);
};