// Backend Contract
export type QuizDashboardSummary = {
  user_id: string;
  averageScorePercent: number;
  studyTimeSecondsToday: number; // seconds
  totalStudySeconds: number;     // seconds
  currentStreakDays: number;
};

// UI Types (Preserved for the rich dashboard interface)
export type WeeklyActivityDay = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  hours: number;
};

export type SubjectMastery = {
  subjectId: string;
  name: string;
  percent: number;       // 0–100
  color: 'blue' | 'green' | 'purple' | 'yellow';
};

export type RecentActivityItem = {
  id: string;
  title: string;
  subtitle: string;      // e.g. "2 hours ago"
  iconType: 'flashcards' | 'quiz' | 'chat' | 'generic';
};

export type QuickAction = {
  id: 'ask-ai' | 'scan-solve' | 'flashcards' | 'take-quiz';
  title: string;
  description: string;
  color: 'blue' | 'teal' | 'green' | 'purple';
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  color: 'yellow' | 'green' | 'blue' | 'purple';
};
