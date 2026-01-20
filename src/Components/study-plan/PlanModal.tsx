
import React, { useState, useEffect } from 'react';
import { StudyPlan } from '../../types/studyPlan.types';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: StudyPlan | null;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200 overflow-hidden">
        <div className="teal-gradient px-8 py-8 text-white">
          <h2 className="text-2xl font-black tracking-tight">{initialData ? 'Update Plan' : 'New Study Plan'}</h2>
          <p className="text-teal-100 text-sm mt-1 opacity-80">Define the container for your academic journey.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-8 space-y-6">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Plan Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Computer Science Track"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-semibold"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-medium h-32 resize-none"
              placeholder="Brief overview of this plan..."
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] teal-gradient text-white py-4 rounded-2xl font-black shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              {initialData ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
