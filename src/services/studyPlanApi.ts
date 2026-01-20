
import { 
  StudyPlanRead, 
  StudyItemRead, 
  Course, 
  CourseSearchResult,
  CreateStudyPlanPayload, 
  CreateStudyItemPayload,
  Term,
  RequirementCategory
} from '../types/studyPlan.types';
import { getValidAccessToken } from './TokenManager';
// Standardizing to CamelCase to resolve naming conflicts
import { MOCK_REQUIREMENT_CATEGORIES } from '../constants/studyPlan.constants';

const API_BASE = 'https://study-plan-service-91248372939.us-central1.run.app/api/v1';

/* ================================
   Utilities
================================= */

// UUID guard to prevent backend crashes
const isValidUUID = (id?: string) =>
  !!id &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );

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
  request(`${API_BASE}/study-plan/`);

/**
 * Fetches a single study plan metadata by ID.
 */
export const fetchStudyPlanById = (id: string): Promise<StudyPlanRead> => {
  if (!isValidUUID(id)) {
    return Promise.reject(new Error('Invalid study plan ID'));
  }
  return request(`${API_BASE}/study-plan/${id}`);
};

/**
 * Fetches study items belonging to a specific plan.
 */
export const fetchStudyItemsByPlanId = (id: string): Promise<StudyItemRead[]> => {
  if (!isValidUUID(id)) {
    return Promise.reject(new Error('Invalid study plan ID'));
  }
  return request(`${API_BASE}/study-plan/${id}/items`);
};

/* ================================
   Courses (SEARCH)
================================= */

/**
 * Search for courses by query.
 * GET /study-plan/courses?q=
 *
 * SAFETY:
 * - Min length enforced
 * - Prevents accidental UUID route collision
 */
export const fetchCoursesBySearch = async (query: string): Promise<CourseSearchResult[]> => {
  const q = query.trim();

  if (q.length < 2) {
    return []; // prevents spam + backend crashes
  }

  return request(
    `${API_BASE}/study-plan/courses?q=${encodeURIComponent(q)}`
  );
};

/**
 * Adds a new study item to a plan.
 * POST /study-plan/items
 */
export const addStudyItem = (payload: any): Promise<StudyItemRead> =>
  request(`${API_BASE}/study-plan/items/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

/**
 * Alias for fetchStudyPlanById used in screens.
 */
export const fetchStudyPlan = fetchStudyPlanById;

/**
 * Fetches all courses (Static list).
 */
export const fetchCourses = (): Promise<Course[]> => 
  request(`${API_BASE}/courses`);


/* ================================
   Create / Update Plans
================================= */
/**
 * Creates a new study plan.
 */
export const createStudyPlan = (payload: CreateStudyPlanPayload): Promise<StudyPlanRead> =>
  request(`${API_BASE}/study-plan/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/**
 * Updates an existing study plan.
 */
export const updateStudyPlan = (id: string, payload: Partial<CreateStudyPlanPayload>): Promise<StudyPlanRead> => {
  if (!isValidUUID(id)) {
    return Promise.reject(new Error('Invalid study plan ID'));
  }
  return request(`${API_BASE}/study-plan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

/**
 * Deletes a study plan.
 */
export const deleteStudyPlan = (id: string): Promise<void> => {
  if (!isValidUUID(id)) {
    return Promise.reject(new Error('Invalid study plan ID'));
  }
  return request(`${API_BASE}/study-plan/${id}`, { method: 'DELETE' });
};


/* ================================
   Predefined Plans
================================= */
/**
 * Creates a new study plan by copying from a predefined plan template.
 * Only name + description required; copies all study items automatically.
 */
export const createStudyPlanFromPredefined = (predefinedPlanId: string, payload: CreateStudyPlanPayload): Promise<StudyPlanRead> => {
  if (!isValidUUID(predefinedPlanId)) {
    return Promise.reject(new Error('Invalid predefined plan ID'));
  }

  return request(
    `${API_BASE}/study-plan/${predefinedPlanId}/from-predefined`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
};

/* ================================
   Study Items
================================= */
/**
 * Creates a new study item (Original endpoint).
 */
export const createStudyItem = (payload: any): Promise<StudyItemRead> => 
  request(`${API_BASE}/study-items/`, {
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
  id: read.item_id,
  course_code: read.course_code,
  title: read.title,
  units: read.duration || 0,
  status: read.status || 'planned',
  term_id: read.term_name,
  requirement_category_id: read.course_category,
  notes: '',
});
