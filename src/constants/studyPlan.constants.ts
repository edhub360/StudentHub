
import { StudyStatus } from '../types/studyPlan.types';

export const STATUS_CONFIG: Record<StudyStatus, { label: string; classes: string }> = {
  planned: {
    label: 'PLANNED',
    classes: 'bg-slate-100 text-slate-500 border-slate-200'
  },
  in_progress: {
    label: 'IN PROGRESS',
    classes: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  completed: {
    label: 'COMPLETED',
    classes: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  },
  locked: {
    label: 'LOCKED',
    classes: 'bg-amber-50 text-amber-600 border-amber-100'
  }
};

export const STATUS_LABELS: Record<StudyStatus, string> = {
  planned: 'PLANNED',
  in_progress: 'IN PROGRESS',
  completed: 'COMPLETED',
  locked: 'LOCKED'
};

export const STATUS_COLORS: Record<StudyStatus, string> = {
  planned: 'bg-slate-100 text-slate-500 border-slate-200',
  in_progress: 'bg-blue-50 text-blue-600 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  locked: 'bg-amber-50 text-amber-600 border-amber-100'
};

export const MOCK_REQUIREMENT_CATEGORIES = [
  { id: 'cat-1', name: 'Major Core' },
  { id: 'cat-2', name: 'General Education' },
  { id: 'cat-3', name: 'Elective' },
  { id: 'cat-4', name: 'Technical Elective' },
];

export const DEFAULT_TERM = "FALL 2025";
