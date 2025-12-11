import React from 'react';
import { SubjectMastery } from '../../types/dashboard.types';

interface SubjectMasteryCardProps {
  subjects: SubjectMastery[];
}

const getProgressColor = (color: string) => {
  switch (color) {
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-emerald-500';
    case 'purple': return 'bg-purple-500';
    case 'yellow': return 'bg-amber-500';
    case 'teal': return 'bg-teal-500';
    default: return 'bg-slate-500';
  }
};

export const SubjectMasteryCard: React.FC<SubjectMasteryCardProps> = ({ subjects }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Subject Mastery</h3>
      
      <div className="space-y-6">
        {subjects.map((subject) => {
          const progressColor = getProgressColor(subject.color);
          
          return (
            <div key={subject.subjectId}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">{subject.name}</span>
                <span className="text-sm font-bold text-slate-500">{subject.percent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${progressColor} transition-all duration-1000 ease-in-out`}
                  style={{ width: `${subject.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};