import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDashboardSummary } from '../../services/dashboardApi';
import { QuizDashboardSummary } from '../../types/dashboard.types';
import { STATIC_DASHBOARD_DATA } from '../../constants/dashboard.constants';
import { StatCard } from '../Dashboard/StatCard';
import { WeeklyActivityCard } from '../Dashboard/WeeklyActivityCard';
import { SubjectMasteryCard } from '../Dashboard/SubjectMasteryCard';
import { RecentActivityCard } from '../Dashboard/RecentActivityCard';
import { QuickActionsCard } from '../Dashboard/QuickActionsCard';
import { AchievementsCard } from '../Dashboard/AchievementCard';
import { 
  Trophy, 
  Target, 
  Clock, 
  Hourglass, 
  Medal, 
  TrendingUp,
  Bell
} from 'lucide-react';

interface DashboardScreenProps {
  setActiveTab: (tab: string) => void;
}

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<QuizDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchDashboardSummary(user.id)
        .then(data => {
          setSummary(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load dashboard data");
          setLoading(false);
        });
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Format study time based on specified logic
  const formatStudyTime = (seconds: number): string => {
    if (seconds === 0) return "0h";
    const minutes = seconds / 60;
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = seconds / 3600;
    return `${hours.toFixed(2)}h`;
  };

  // Derive stats from API or fallback
  const studyTimeLabel = summary ? formatStudyTime(summary.studyTimeSecondsToday) : "0h";
  const totalStudyHours = summary ? (summary.totalStudySeconds / 3600) : 0;
  const averageScore = summary ? summary.averageScorePercent : 0;
  const streakDays = summary ? summary.currentStreakDays : 0;

  // Mock goal completion for now
  const goalCompletionPercent = 75; 

  const handleQuickAction = (id: string) => {
    console.log(`Navigating to action: ${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-12 bg-slate-50 min-h-screen">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 p-8 shadow-lg text-white">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Student"}!</h2>
          <p className="text-teal-50 text-lg opacity-90">Ready to continue your learning journey?</p>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 right-20 h-40 w-40 rounded-full bg-sky-300 opacity-20 blur-xl pointer-events-none"></div>
      </section>

      {/* Key Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard 
          label="Study Streak" 
          value={`${streakDays} days`} 
          subValue="Keep it up!" 
          icon={Trophy} 
          color="yellow" 
        />
        <StatCard 
          label="Today's Goal" 
          value={`${goalCompletionPercent}%`} 
          progress={goalCompletionPercent}
          icon={Target} 
          color="green" 
        />
        <StatCard 
          label="Study Time Today" 
          value={studyTimeLabel} 
          subValue="Today"
          icon={Clock} 
          color="blue" 
        />
        <StatCard 
          label="Total Study Time" 
          value={`${totalStudyHours.toFixed(0)}h`} 
          subValue="Lifetime"
          icon={Hourglass} 
          color="blue" 
        />
        <StatCard 
          label="Badges Earned" 
          value={STATIC_DASHBOARD_DATA.achievements.length + 8} // Mock number
          subValue="Earned"
          icon={Medal} 
          color="purple" 
        />
        <StatCard 
          label="Average Score" 
          value={`${averageScore.toFixed(0)}%`} 
          subValue="Across all quizzes"
          icon={TrendingUp} 
          color="purple" 
        />
      </section>

      {/* Middle Row: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityCard data={STATIC_DASHBOARD_DATA.weeklyActivity} />
        <SubjectMasteryCard subjects={STATIC_DASHBOARD_DATA.subjectMastery} />
      </section>

      {/* Bottom Row: Lists and Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivityCard activities={STATIC_DASHBOARD_DATA.recentActivity} />
        <QuickActionsCard actions={STATIC_DASHBOARD_DATA.quickActions} onActionClick={handleQuickAction} />
        <AchievementsCard achievements={STATIC_DASHBOARD_DATA.achievements} />
      </section>

    </div>
  );
};

export default DashboardScreen;