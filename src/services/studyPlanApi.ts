
import axios, { AxiosError } from 'axios';
import { 
  Term, 
  StudyItem, 
  NewStudyItemPayload, 
  UpdateStudyItemPayload,
  RequirementCategory
} from '../types/studyPlan.types';
import { STUDY_PLAN_API_BASE_URL } from '../constants/studyPlan.constants';

const api = axios.create({
  baseURL: STUDY_PLAN_API_BASE_URL,
});

// Setup interceptor for the Bearer token
export const setupApiAuth = (token: string) => {
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export async function fetchTerms(): Promise<Term[]> {
  try {
    const response = await api.get('/study-plan/terms');
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function fetchRequirementCategories(): Promise<RequirementCategory[]> {
  try {
    const response = await api.get('/study-plan/requirement-categories');
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function createTerm(name: string): Promise<Term> {
  try {
    const response = await api.post('/study-plan/terms', { name });
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function fetchStudyItems(termId: string): Promise<StudyItem[]> {
  try {
    const response = await api.get(`/study-plan/terms/${termId}/items`);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function createStudyItem(payload: NewStudyItemPayload): Promise<StudyItem> {
  try {
    const response = await api.post('/study-plan/items', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function updateStudyItem(itemId: string, payload: UpdateStudyItemPayload): Promise<StudyItem> {
  try {
    const response = await api.patch(`/study-plan/items/${itemId}`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function deleteStudyItem(itemId: string): Promise<void> {
  try {
    await api.delete(`/study-plan/items/${itemId}`);
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

function handleApiError(error: AxiosError) {
  if (error.response) {
    return {
      status: error.response.status,
      message: (error.response.data as any)?.detail || "API Error: Request failed.",
    };
  }
  return { status: 500, message: "Network error. Please check your connection." };
}
