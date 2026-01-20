
import React from 'react';
import { StudyItem, Term, RequirementCategory } from '../../types/studyPlan.types';
import StudyItemRow from './StudyItemRow';

interface StudyPlanListProps {
  items: StudyItem[];
  isLoading: boolean;
  terms: Term[];
  requirementCategories: RequirementCategory[];
  onEdit: (item: StudyItem) => void;
  onDelete: (id: string) => void;
  onToggleLock: (item: StudyItem) => void;
}

const StudyPlanList: React.FC<StudyPlanListProps> = ({ 
  items, 
  isLoading, 
  requirementCategories,
  onEdit, 
  onDelete, 
  onToggleLock 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-24 text-center">
        <div className="animate-spin w-10 h-10 border-[4px] border-teal-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <p className="text-slate-400 font-bold tracking-tight">Syncing roadmap...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-24 text-center">
        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-3">No courses found</h3>
        <p className="text-slate-400 max-w-sm mx-auto font-medium">No courses match your criteria or the plan is currently empty.</p>
      </div>
    );
  }

  const requirementById = new Map(
    requirementCategories.map((rc) => [rc.id, rc.name])
  );

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/6">Requirement</th>
              <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Course</th>
              <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/3">Course Title</th>
              <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Units</th>
              <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Status</th>
              <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <StudyItemRow 
                key={item.id} 
                item={item} 
                requirementName={
                  (item.requirement_category_id &&
                    requirementById.get(item.requirement_category_id)) ||
                  'General Education'
                }
                onEdit={onEdit} 
                onDelete={onDelete} 
                onToggleLock={onToggleLock}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50/30 px-8 py-6 flex justify-between items-center border-t border-slate-50">
        <div className="flex items-center space-x-2">
           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Inventory</span>
           <span className="text-sm font-bold text-slate-600">{items.length} Courses</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Credits</span>
          <span className="text-lg font-black text-teal-600 px-4 py-1 bg-teal-50 rounded-full">{items.reduce((acc, curr) => acc + curr.units, 0)} Units</span>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanList;
