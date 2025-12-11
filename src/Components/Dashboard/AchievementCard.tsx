import React from 'react';
import { Achievement } from '../../types/dashboard.types';
import { Trophy, Medal, Target } from 'lucide-react';

interface AchievementsCardProps {
  achievements: Achievement[];
}

// Helper icons specifically for this component
const BrainCircuitIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.465"/><path d="M19.97 14.535A4 4 0 0 1 18 18"/></svg>
);
const LayersIcon = ({size}: {size: number}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
);

const getAchievementIcon = (title: string) => {
  if (title.toLowerCase().includes('streak')) return Trophy;
  if (title.toLowerCase().includes('quiz')) return BrainCircuitIcon;
  if (title.toLowerCase().includes('flashcard')) return LayersIcon;
  if (title.toLowerCase().includes('goal')) return Target;
  return Medal;
};

const getAchievementTheme = (color: string) => {
  switch (color) {
    case 'yellow': return { bg: 'bg-amber-50', text: 'text-amber-600' };
    case 'green': return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
    case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-600' };
    case 'teal': return { bg: 'bg-teal-50', text: 'text-teal-600' };
    default: return { bg: 'bg-slate-50', text: 'text-slate-600' };
  }
};

export const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Achievements</h3>
      
      <div className="space-y-4">
        {achievements.map((achievement) => {
          const Icon = getAchievementIcon(achievement.title);
          const theme = getAchievementTheme(achievement.color);
          
          return (
            <div key={achievement.id} className={`flex items-center gap-4 p-4 rounded-xl border border-transparent ${theme.bg}`}>
              <div className={`p-3 rounded-full bg-white shadow-sm ${theme.text}`}>
                <Icon size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{achievement.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{achievement.description}</p>
              </div>
            </div>
          );
        })}
        {achievements.length === 0 && (
           <p className="text-sm text-slate-400 text-center py-4">No achievements yet. Keep learning!</p>
        )}
      </div>
    </div>
  );
};