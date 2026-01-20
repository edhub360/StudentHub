
export type StudyStatus = 'planned' | 'in_progress' | 'completed' | 'locked';
// Base interfaces for the UI components
export interface StudyItem {
  id: string;
  course_code: string;
  title: string;
  units: number;
  status: StudyStatus;
  term_id: string;
  requirement_category_id?: string;
  notes?: string;
}

export interface Term {
  id: string;
  name: string;
}

export interface RequirementCategory {
  id: string;
  name: string;
}

export interface StudyPlan {
  id: string;
  name: string;
  description?: string;
  study_items: StudyItem[];
}

// API Read interfaces
export interface StudyPlanRead {
  id: string;
  name: string;
  description?: string;
  coursecount: number;
  duration: number;
  is_predefined: boolean;
  studyitems: StudyItemRead[];
}

export interface StudyItemRead {
  item_id: string;
  userid: string;
  term_name: string;
  course_category: string;
  course_code: string;
  title: string;
  duration?: number;
  position_index?: number;
  status?: StudyStatus;
  studyplanid?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  duration: number;
  units: number;
}

export interface CreateStudyPlanPayload {
  name: string;
  description?: string;
}

// Alias to fix import errors in screens
export type NewStudyItemPayload = CreateStudyItemPayload;

// Payload for creating a new Study Item
export interface CreateStudyItemPayload {
  term_name: string;
  course_category: string;
  course_code: string;
  title: string;
  study_plan_id: string;
  duration: number;
  position_index: number;
  status: StudyStatus;
}

/**
 * Updated Course Interface for Search 
 */
export interface CourseSearchResult {
  course_id: string;
  course_code: string;
  course_title: string;
  course_category: string;
  course_duration: number;
}


