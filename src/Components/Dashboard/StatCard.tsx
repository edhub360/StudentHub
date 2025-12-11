import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'teal';
  progress?: number; // 0-100
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  color = 'blue',
  progress 
}) => {
  // Determine color classes based on the prop
  const getColorClass = (c: string) => {
    switch(c) {
      case 'green': return 'text-emerald-500 bg-emerald-50';
      case 'purple': return 'text-purple-500 bg-purple-50';
      case 'yellow': return 'text-amber-500 bg-amber-50';
      case 'teal': return 'text-teal-500 bg-teal-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };
  
  const getProgressColor = (c: string) => {
     switch(c) {
      case 'green': return 'bg-emerald-500';
      case 'purple': return 'bg-purple-500';
      case 'yellow': return 'bg-amber-500';
      case 'teal': return 'bg-teal-500';
      default: return 'bg-blue-500';
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {subValue && <p className="text-slate-400 text-xs mt-1">{subValue}</p>}
        </div>
        <div className={cn("p-3 rounded-xl", getColorClass(color))}>
          <Icon size={24} />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1.5 text-slate-500 font-medium">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor(color))} 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
