import { API_BASE_URL as UPLOADSOLVE_API_BASE_URL } from '../constants/uploadsolve.constants';
import { SolveImageResponse } from '../types/uploadsolve.types';
import { getValidAccessToken } from './TokenManager';

// --- API CLIENT ---
// This file is the API client for the Screenshot-to-Solve feature.
// Components (like UploadScreen.tsx) should import solveImage and call it when the user clicks "Analyze Image".
// User identity (name/email) is available through useAuth, but JWT comes from getValidAccessToken().

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
    // Handle 401 specifically
    if (response.status === 401) {
      throw new Error("Your session expired. Please log in again.");
    }

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

export async function solveImage(
  file: File,
  subject: string | null,
  mode: "steps" | "final",
): Promise<SolveImageResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (subject) {
    formData.append('subject', subject);
  }
  formData.append('mode', mode);

  // getHeaders(false) skips Content-Type so browser sets boundary for FormData
  const headers = await getHeaders(false);

  const response = await fetch(`${UPLOADSOLVE_API_BASE_URL}/chat/solve-image`, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  return handleResponse(response) as Promise<SolveImageResponse>;
}
