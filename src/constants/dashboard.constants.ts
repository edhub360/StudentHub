import { 
  WeeklyActivityDay, 
  SubjectMastery, 
  RecentActivityItem, 
  QuickAction, 
  Achievement 
} from '../types/dashboard.types';

export const STATIC_DASHBOARD_DATA = {
  weeklyActivity: [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 210 },
    { day: 'Wed', minutes: 90 },
    { day: 'Thu', minutes: 120 },
    { day: 'Fri', minutes: 240 },
    { day: 'Sat', minutes: 180 },
    { day: 'Sun', minutes: 60 },
  ] as WeeklyActivityDay[],
  subjectMastery: [
    { subjectId: '1', name: 'Mathematics', percent: 85, color: 'blue' },
    { subjectId: '2', name: 'Biology', percent: 72, color: 'green' },
    { subjectId: '3', name: 'Physics', percent: 63, color: 'purple' },
    { subjectId: '4', name: 'History', percent: 78, color: 'yellow' },
  ] as SubjectMastery[],
  recentActivity: [
    { id: '1', title: 'Completed Calculus flashcards', subtitle: '2 hours ago', iconType: 'flashcards' },
    { id: '2', title: 'Biology quiz - 85% score', subtitle: 'Yesterday', iconType: 'quiz' },
    { id: '3', title: 'AI Chat session on Physics', subtitle: '2 days ago', iconType: 'chat' },
  ] as RecentActivityItem[],
  quickActions: [
    { id: 'ask-ai', title: 'Ask AI', description: 'Get instant help', color: 'blue' },
    { id: 'scan-solve', title: 'Scan & Solve', description: 'Photo questions', color: 'teal' },
    { id: 'flashcards', title: 'Flashcards', description: 'Review concepts', color: 'green' },
    { id: 'take-quiz', title: 'Take Quiz', description: 'Test knowledge', color: 'purple' },
  ] as QuickAction[],
  achievements: [
    { id: '1', title: 'Study Streak Champion', description: '7 days in a row!', color: 'yellow' },
    { id: '2', title: 'Quiz Master', description: 'Perfect score on Math quiz', color: 'blue' },
    { id: '3', title: 'Flashcard Expert', description: '100 cards mastered', color: 'green' },
    { id: '4', title: 'Goal Achiever', description: 'Weekly target reached', color: 'purple' },
  ] as Achievement[],
};