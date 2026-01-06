
import { 
  StudyPlanRead, 
  StudyItemRead, 
  Course, 
  CreateStudyPlanPayload, 
  CreateStudyItemPayload,
  Term,
  RequirementCategory
} from '../types/studyPlan.types';
import { getValidAccessToken } from './TokenManager';
import { MOCK_REQUIREMENT_CATEGORIES } from '../constants/studyPlan.constants';

const API_BASE = 'https://study-plan-service-91248372939.us-central1.run.app/api/v1';

const getHeaders = async () => {
  const token = await getValidAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const request = async (url: string, options: RequestInit = {}) => {
  const headers = await getHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || errorBody.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

/**
 * Fetches all study plans.
 */
export const fetchStudyPlans = (): Promise<StudyPlanRead[]> => 
  request(`${API_BASE}/study-plan`);

/**
 * Fetches a single study plan by ID.
 */
export const fetchStudyPlanById = (id: string): Promise<StudyPlanRead> => 
  request(`${API_BASE}/study-plan/${id}`);

/**
 * Alias for fetchStudyPlanById used in screens.
 */
export const fetchStudyPlan = fetchStudyPlanById;

/**
 * Creates a new study plan.
 */
export const createStudyPlan = (payload: CreateStudyPlanPayload): Promise<StudyPlanRead> => 
  request(`${API_BASE}/study-plan`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

/**
 * Updates an existing study plan.
 */
export const updateStudyPlan = (id: string, payload: Partial<CreateStudyPlanPayload>): Promise<StudyPlanRead> =>
  request(`${API_BASE}/study-plan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

/**
 * Deletes a study plan.
 */
export const deleteStudyPlan = (id: string): Promise<void> => 
  request(`${API_BASE}/study-plan/${id}`, { method: 'DELETE' });

/**
 * Creates a new study item.
 */
export const createStudyItem = (payload: any): Promise<StudyItemRead> => 
  request(`${API_BASE}/study-items`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

/**
 * Updates an existing study item.
 */
export const updateStudyItem = (itemId: string, payload: any): Promise<StudyItemRead> =>
  request(`${API_BASE}/study-items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

/**
 * Deletes a study item.
 */
export const deleteStudyItem = (itemId: string): Promise<void> => 
  request(`${API_BASE}/study-items/${itemId}`, { method: 'DELETE' });

/**
 * Fetches all courses.
 */
export const fetchCourses = (): Promise<Course[]> => 
  request(`${API_BASE}/courses`);

/**
 * Fetches available academic terms.
 */
export const fetchTerms = async (): Promise<Term[]> => {
  return [
    { id: 'FALL 2025', name: 'Fall 2025' },
    { id: 'SPRING 2026', name: 'Spring 2026' },
    { id: 'FALL 2026', name: 'Fall 2026' },
    { id: 'SPRING 2027', name: 'Spring 2027' },
  ];
};

/**
 * Fetches available requirement categories.
 */
export const fetchRequirementCategories = async (): Promise<RequirementCategory[]> => {
  return MOCK_REQUIREMENT_CATEGORIES;
};

/**
 * Helper to map API Read model to UI StudyItem model.
 */
export const mapReadToStudyItem = (read: StudyItemRead): any => ({
  id: read.itemid,
  course_code: read.coursecode,
  title: read.title,
  units: read.duration || 0,
  status: read.status || 'planned',
  term_id: read.termname,
  requirement_category_id: read.course_category,
  notes: '',
});
