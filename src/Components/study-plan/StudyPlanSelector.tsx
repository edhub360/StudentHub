import React from 'react';
import { StudyPlanRead } from '../../types/studyPlan.types';

interface StudyPlanSelectorProps {
  plans: StudyPlanRead[];
  selectedId: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
  label?: string;
}

const StudyPlanSelector: React.FC<StudyPlanSelectorProps> = ({ 
  plans, 
  selectedId, 
  onSelect, 
  isLoading, 
  label = "Select Study Plan Template" 
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
        {label}
      </label>
      <div className="relative group">
        <select 
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          disabled={isLoading}
          className="w-full bg-slate-50 border border-slate-200 rounded-[20px] px-6 py-5 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all appearance-none cursor-pointer disabled:opacity-50"
        >
          <option value="">Start with a blank roadmap...</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.name} {plan.is_predefined ? '(Official Template)' : ''}
            </option>
          ))}
        </select>
        
        {/* Subtitle Display for selected plan */}
        {selectedId && (
          <div className="mt-3 px-6 py-3 bg-teal-50/50 border border-teal-100/50 rounded-xl animate-in fade-in slide-in-from-top-2">
            <p className="text-[11px] font-medium text-teal-700 italic leading-relaxed">
              {plans.find(p => p.id === selectedId)?.description || "Complete curriculum template"}
            </p>
          </div>
        )}

        <div className="absolute right-6 top-[26px] pointer-events-none text-slate-400 group-hover:text-teal-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanSelector;
