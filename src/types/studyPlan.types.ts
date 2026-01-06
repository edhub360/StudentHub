
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
  itemid: string;
  userid: string;
  termname: string;
  course_category: string;
  coursecode: string;
  title: string;
  duration?: number;
  positionindex?: number;
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

export interface CreateStudyItemPayload {
  termname: string;
  course_category: string;
  coursecode: string;
  title: string;
  studyplanid: string;
  duration: number;
  positionindex: number;
  status: StudyStatus;
}
