import React from "react";
import { Clock, Award, TrendingUp, Trophy, Brain, FileText, Target } from "lucide-react";

interface WeeklyActivity {
  day: string;
  hours: number;
  progress: number; // percentage
}

interface SubjectProgress {
  subject: string;
  progress: number; // percentage
  color: string;
}

interface Achievement {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}

const ProgressScreen: React.FC = () => {
  const weeklyActivity: WeeklyActivity[] = [
    { day: "Monday", hours: 2, progress: 40 },
    { day: "Tuesday", hours: 3, progress: 60 },
    { day: "Wednesday", hours: 1, progress: 30 },
    { day: "Thursday", hours: 2, progress: 50 },
    { day: "Friday", hours: 3, progress: 70 },
    { day: "Saturday", hours: 2, progress: 60 },
    { day: "Sunday", hours: 1, progress: 20 },
  ];

  const subjectProgress: SubjectProgress[] = [
    { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
    { subject: "Biology", progress: 72, color: "bg-green-500" },
    { subject: "Physics", progress: 63, color: "bg-purple-500" },
    { subject: "History", progress: 78, color: "bg-yellow-500" },
  ];

  const achievements: Achievement[] = [
    { title: "Study Streak Champion", subtitle: "7 days in a row!", icon: <Trophy className="w-6 h-6 text-white" />, bgColor: "bg-yellow-500" },
    { title: "Quiz Master", subtitle: "Perfect score on Math quiz", icon: <Brain className="w-6 h-6 text-white" />, bgColor: "bg-blue-500" },
    { title: "Flashcard Expert", subtitle: "100 cards mastered", icon: <FileText className="w-6 h-6 text-white" />, bgColor: "bg-green-500" },
    { title: "Goal Achiever", subtitle: "Weekly target reached", icon: <Target className="w-6 h-6 text-white" />, bgColor: "bg-purple-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Tracker</h2>
        <p className="text-gray-600">Monitor your learning journey and achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">47h</p>
          <p className="text-sm text-gray-600">Total Study Time</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-600">Badges Earned</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">85%</p>
          <p className="text-sm text-gray-600">Average Score</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">7</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Weekly Activity</h3>
          <div className="space-y-4">
            {weeklyActivity.map((item) => (
              <div key={item.day} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-20">{item.day.slice(0, 3)}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-teal-500`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-8">{item.hours}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Mastery */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Subject Mastery</h3>
          <div className="space-y-6">
            {subjectProgress.map((sub) => (
              <div key={sub.subject}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{sub.subject}</span>
                  <span className="text-sm text-gray-600">{sub.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${sub.color} h-3 rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div key={ach.title} className={`flex items-center gap-4 p-4 ${ach.bgColor.replace("-500", "-50")} rounded-xl`}>
              <div className={`w-12 h-12 ${ach.bgColor} rounded-full flex items-center justify-center`}>
                {ach.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{ach.title}</p>
                <p className="text-sm text-gray-600">{ach.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen;
