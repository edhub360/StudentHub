import React from 'react';
import { RecentActivityItem } from '../../types/dashboard.types';
import { FileText, Zap, MessageSquare, Clock } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecentActivityCardProps {
  activities: RecentActivityItem[];
}

const getIcon = (type: RecentActivityItem['iconType']) => {
  switch (type) {
    case 'flashcards': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'quiz': return { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' };
    case 'chat': return { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    default: return { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' };
  }
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
      
      <div className="flex-1 space-y-4">
        {activities.map((item) => {
          const { icon: Icon, color, bg } = getIcon(item.iconType);
          return (
            <div key={item.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-default">
              <div className={cn("p-2.5 rounded-lg flex-shrink-0", bg, color)}>
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 leading-tight mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
        {activities.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No recent activity found.</p>
        )}
      </div>
    </div>
  );
};