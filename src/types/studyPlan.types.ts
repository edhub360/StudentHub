
export type StudyStatus = "planned" | "locked" | "completed" | "in_progress";

export interface Term {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  position_index: number;
  is_archived: boolean;
}

export interface StudyItem {
  id: string;
  term_id: string;
  requirement_category_id: string | null;
  course_code: string;
  title: string;
  units: number;
  status: StudyStatus;
  position_index: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewStudyItemPayload {
  term_id: string;
  course_code: string;
  title: string;
  units: number;
  status: StudyStatus;
  notes?: string;
  requirement_category_id?: string;
}

export interface UpdateStudyItemPayload {
  term_id?: string;
  course_code?: string;
  title?: string;
  units?: number;
  status?: StudyStatus;
  notes?: string;
}
