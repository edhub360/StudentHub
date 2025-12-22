
import React from 'react';

interface StudyPlanToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddCourse: () => void;
}

const StudyPlanToolbar: React.FC<StudyPlanToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onAddCourse,
}) => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Left: Search Input */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2 ml-1">Search Courses</label>
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by course title..."
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl pl-11 pr-5 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all min-w-[280px]"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Add Course Button */}
      <button 
        onClick={onAddCourse}
        className="teal-gradient text-white px-8 py-4 rounded-xl text-sm font-bold shadow-xl shadow-teal-500/25 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
        <span>Add Course</span>
      </button>
    </div>
  );
};

export default StudyPlanToolbar;
