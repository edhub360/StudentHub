
import React, { useState, useEffect } from 'react';
import { StudyItem, StudyStatus, NewStudyItemPayload, Term } from '../../types/studyPlan.types';
import { MOCK_REQUIREMENT_CATEGORIES } from '../../constants/studyPlan.constants';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: StudyItem | null;
  selectedTerm: Term | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSubmit, initialData, selectedTerm }) => {
  const [formData, setFormData] = useState({
    course_code: '',
    title: '',
    units: 3,
    status: 'planned' as StudyStatus,
    notes: '',
    requirement_category_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        course_code: initialData.course_code,
        title: initialData.title,
        units: initialData.units,
        status: initialData.status,
        notes: initialData.notes || '',
        requirement_category_id: initialData.requirement_category_id || ''
      });
    } else {
      setFormData({
        course_code: '',
        title: '',
        units: 3,
        status: 'planned',
        notes: '',
        requirement_category_id: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, term_id: selectedTerm?.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200 overflow-hidden">
        <div className="teal-gradient px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{initialData ? 'Edit Course' : 'Add New Course'}</h2>
            <p className="text-teal-100 text-xs mt-0.5">{selectedTerm?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Course Code</label>
              <input 
                required
                value={formData.course_code}
                onChange={e => setFormData({...formData, course_code: e.target.value})}
                placeholder="e.g. CS101"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Units</label>
              <input 
                required
                type="number"
                min="0"
                value={formData.units}
                onChange={e => setFormData({...formData, units: parseInt(e.target.value)})}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Course Title</label>
            <input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Full course name"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Requirement Category</label>
            <select 
              value={formData.requirement_category_id}
              onChange={e => setFormData({...formData, requirement_category_id: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm"
            >
              <option value="">Select Category</option>
              {MOCK_REQUIREMENT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Status</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as StudyStatus})}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm"
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Notes (Optional)</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm h-24 resize-none"
              placeholder="Any reminders or requirements..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] teal-gradient text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {initialData ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
