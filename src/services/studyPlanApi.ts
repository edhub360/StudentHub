import {
  Term,
  StudyItem,
  NewStudyItemPayload,
  UpdateStudyItemPayload,
  RequirementCategory,
} from '../types/studyPlan.types';
import { STUDY_PLAN_API_BASE_URL } from '../constants/studyPlan.constants';
import { getValidAccessToken } from '../services/TokenManager';

// ---- helpers ----

const getHeaders = async (isJson = true): Promise<HeadersInit> => {
  const token = await getValidAccessToken(); // will refresh if expired
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = response.statusText || 'Request failed';
    try {
      const data = await response.json();
      if (data && typeof data === 'object' && 'detail' in data) {
        message = (data as any).detail || message;
      }
    } catch {
      // ignore JSON parse error
    }
    // Surface specific session/401 errors to the caller
    throw new Error(message);
  }

  if (response.status === 204) {
    // No Content
    return null as unknown as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null as unknown as T;
  }
};

// ---- API functions ----

export async function fetchTerms(): Promise<Term[]> {
  const headers = await getHeaders();
  const res = await fetch(`${STUDY_PLAN_API_BASE_URL}/study-plan/terms`, {
    method: 'GET',
    headers,
  });
  return handleResponse<Term[]>(res);
}

export async function fetchRequirementCategories(): Promise<RequirementCategory[]> {
  const headers = await getHeaders();
  const res = await fetch(
    `${STUDY_PLAN_API_BASE_URL}/study-plan/requirements`,
    {
      method: 'GET',
      headers,
    }
  );
  return handleResponse<RequirementCategory[]>(res);
}

export async function createTerm(name: string): Promise<Term> {
  const headers = await getHeaders();
  const res = await fetch(`${STUDY_PLAN_API_BASE_URL}/study-plan/terms`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name }),
  });
  return handleResponse<Term>(res);
}

export async function fetchAllStudyItems(): Promise<StudyItem[]> {
  const headers = await getHeaders();
  const res = await fetch(`${STUDY_PLAN_API_BASE_URL}/study-plan/items`, {
    method: 'GET',
    headers,
  });
  return handleResponse<StudyItem[]>(res);
}


export async function fetchStudyItems(termId: string): Promise<StudyItem[]> {
  const headers = await getHeaders();
  const res = await fetch(
    `${STUDY_PLAN_API_BASE_URL}/study-plan/terms/${termId}/items`,
    {
      method: 'GET',
      headers,
    }
  );
  return handleResponse<StudyItem[]>(res);
}

export async function createStudyItem(
  payload: NewStudyItemPayload
): Promise<StudyItem> {
  const headers = await getHeaders();
  const res = await fetch(`${STUDY_PLAN_API_BASE_URL}/study-plan/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<StudyItem>(res);
}

export async function updateStudyItem(
  itemId: string,
  payload: UpdateStudyItemPayload
): Promise<StudyItem> {
  const headers = await getHeaders();
  const res = await fetch(
    `${STUDY_PLAN_API_BASE_URL}/study-plan/items/${itemId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload),
    }
  );
  return handleResponse<StudyItem>(res);
}

export async function deleteStudyItem(itemId: string): Promise<void> {
  const headers = await getHeaders();
  const res = await fetch(
    `${STUDY_PLAN_API_BASE_URL}/study-plan/items/${itemId}`,
    {
      method: 'DELETE',
      headers,
    }
  );
  await handleResponse(res);
}
