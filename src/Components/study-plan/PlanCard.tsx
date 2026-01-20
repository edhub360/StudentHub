
import React from 'react';
import { StudyPlanRead } from '../../types/studyPlan.types';

interface PlanCardProps {
  plan: StudyPlanRead;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onClick, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        {!plan.is_predefined && (
          <button 
            onClick={onDelete}
            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        )}
      </div>

      <h4 className="text-xl font-black text-slate-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">{plan.name}</h4>
      <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 h-10 flex-grow">
        {plan.description || "Building your academic roadmap, one term at a time."}
      </p>

      <div className="flex items-center justify-between border-t border-slate-50 pt-6">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Items</span>
          <span className="text-sm font-black text-slate-700">{plan.coursecount}</span>
        </div>
        <div className="text-[10px] font-black text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-teal-100 group-hover:bg-teal-500 group-hover:text-white transition-all">
          Open Plan
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
