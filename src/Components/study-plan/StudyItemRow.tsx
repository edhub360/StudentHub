
import React from 'react';
import { StudyItem } from '../../types/studyPlan.types';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/studyPlan.constants';

interface StudyItemRowProps {
  item: StudyItem;
  requirementName: string;
  onEdit: (item: StudyItem) => void;
  onDelete: (id: string) => void;
  onToggleLock: (item: StudyItem) => void;
}

const StudyItemRow: React.FC<StudyItemRowProps> = ({ 
  item, 
  requirementName,
  onEdit, 
  onDelete, 
  onToggleLock 
}) => {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      <td className="py-6 px-6">
        <div className="flex flex-col gap-1">
          <span className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 self-start">
            {requirementName}
          </span>
        </div>
      </td>
      <td className="py-6 px-6">
        <span className="font-black text-slate-800 text-sm tracking-tight">{item.course_code}</span>
      </td>
      <td className="py-6 px-6">
        <span className="text-slate-600 font-semibold text-sm">{item.title}</span>
      </td>
      <td className="py-6 px-6 text-center">
        <span className="text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{item.units}</span>
      </td>
      <td className="py-6 px-6">
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${STATUS_COLORS[item.status]}`}>
          {item.status === 'locked' && (
            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          )}
          {STATUS_LABELS[item.status]}
        </div>
      </td>
      <td className="py-6 px-6 text-right">
        <div className="flex items-center justify-end space-x-2 md:opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          <button 
            onClick={() => onToggleLock(item)}
            className={`p-2 rounded-xl transition-all ${item.status === 'locked' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
            title={item.status === 'locked' ? "Unlock Course" : "Lock Course"}
          >
            {item.status === 'locked' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            )}
          </button>
          <button 
            onClick={() => onEdit(item)}
            className="p-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all"
            title="Edit Course"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
            title="Delete Course"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudyItemRow;
