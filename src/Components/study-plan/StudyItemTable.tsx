
import React from 'react';
import { StudyItemRead } from '../../types/studyPlan.types';
import { STATUS_CONFIG } from '../../constants/studyPlan.constants';

interface StudyItemTableProps {
  items: StudyItemRead[];
  onDelete: (id: string) => void;
  onToggleLock: (item: StudyItemRead) => void;
}

const StudyItemTable: React.FC<StudyItemTableProps> = ({ items, onDelete, onToggleLock }) => {
  // Sort items by term and then position index to maintain a logical flow even without headers
  const sortedItems = [...items].sort((a, b) => {
    const termA = a.termname.toUpperCase();
    const termB = b.termname.toUpperCase();
    if (termA !== termB) return termA.localeCompare(termB);
    return (a.positionindex || 0) - (b.positionindex || 0);
  });

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/6">Category</th>
              <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Code</th>
              <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/4">Course Title</th>
              <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Units</th>
              <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Status</th>
              <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
                  No courses found matching your criteria.
                </td>
              </tr>
            ) : (
              sortedItems.map(item => (
                <tr key={item.itemid} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-6 px-8">
                    <span className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {item.course_category}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
                      {item.termname}
                    </span>
                  </td>
                  <td className="py-6 px-8 font-black text-slate-800 text-sm">{item.coursecode}</td>
                  <td className="py-6 px-8 text-slate-600 font-semibold text-sm">{item.title}</td>
                  <td className="py-6 px-8 text-center">
                    <span className="text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{item.duration}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${STATUS_CONFIG[item.status || 'planned'].classes}`}>
                      {item.status === 'locked' && <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
                      {STATUS_CONFIG[item.status || 'planned'].label}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end space-x-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => onToggleLock(item)} 
                        className={`p-2 rounded-xl transition-all ${item.status === 'locked' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                        title="Lock/Unlock Course"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      </button>
                      <button 
                        onClick={() => onDelete(item.itemid)} 
                        className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                        title="Delete Course"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50/30 px-8 py-8 flex justify-between items-center border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Credits</span>
          <span className="text-xl font-black text-teal-600 bg-teal-50 px-5 py-2 rounded-2xl border border-teal-100">{items.reduce((acc, curr) => acc + (curr.duration || 0), 0)} Units</span>
        </div>
      </div>
    </div>
  );
};

export default StudyItemTable;
