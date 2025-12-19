
import { StudyStatus } from '../types/studyPlan.types';

export const STUDY_PLAN_API_BASE_URL = 
  (import.meta as any).env?.VITE_STUDY_PLAN_API_BASE_URL || "https://study-plan-service-91248372939.us-central1.run.app/api/v1";

export const STATUS_LABELS: Record<StudyStatus, string> = {
  planned: "Planned",
  locked: "Locked",
  completed: "Completed",
  in_progress: "In Progress"
};

export const STATUS_COLORS: Record<StudyStatus, string> = {
  planned: "bg-slate-100 text-slate-500 border-slate-200",
  locked: "bg-slate-100 text-slate-500 border-slate-200",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  in_progress: "bg-blue-50 text-blue-600 border-blue-100"
};

export const MOCK_REQUIREMENT_CATEGORIES = [
  { id: 'cat-1', name: 'Major Requirement' },
  { id: 'cat-2', name: 'General Education' },
  { id: 'cat-3', name: 'Minor Requirement' },
  { id: 'cat-4', name: 'Elective' }
];
