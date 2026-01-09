
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/studyPlanApi';
import StudyPlanSelector from './StudyPlanSelector';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Fetch available plans to use as templates
  const { data: plans = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['study-plans'],
    queryFn: api.fetchStudyPlans,
    enabled: isOpen
  });

  const mutation = useMutation({
    mutationFn: async () => {
      // 1. Create the new plan shell
      const newPlan = await api.createStudyPlan({ name, description });
      
      // 2. Copy from CACHED plans (no API call!)
      if (selectedTemplateId) {
        // ✅ Use plans from useQuery (already loaded, has auth)
        const templatePlan = plans.find(p => p.id === selectedTemplateId);
        
        if (templatePlan?.studyitems?.length) {
          const copyPromises = templatePlan.studyitems.map((item, index) => 
            api.createStudyItem({
              studyplanid: newPlan.id,
              coursecode: item.coursecode,
              title: item.title,
              course_category: item.course_category,
              duration: item.duration || 0,
              termname: item.termname,
              status: 'planned',
              positionindex: item.positionindex ?? index
            })
          );
          await Promise.all(copyPromises);
        }
      }
      
      return newPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      handleClose();
    },
    onError: (error: Error) => {
      alert(`Failed to build roadmap: ${error.message}`);
    }
  });


  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedTemplateId('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || mutation.isPending) return;
    mutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose}></div>
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl relative animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="teal-gradient px-10 py-10 text-white relative">
           <h2 className="text-3xl font-black tracking-tight mb-2">Build New Roadmap</h2>
           <p className="text-teal-50 text-sm font-medium opacity-80 italic">Clone a curriculum or start fresh with your own design.</p>
           
           <button onClick={handleClose} className="absolute top-8 right-8 p-2 hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Metadata Section */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Plan Name</label>
              <input 
                required
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. BS in Computer Science - 2025"
                className="bg-slate-50 border border-slate-200 rounded-[20px] px-6 py-5 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-[20px] px-6 py-5 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-medium h-24 resize-none text-slate-600 placeholder:text-slate-300"
                placeholder="Briefly summarize the goal of this study roadmap..."
              />
            </div>
          </div>

          {/* Template Selection Section */}
          <div className="pt-4 border-t border-slate-50">
            <StudyPlanSelector 
              plans={plans}
              selectedId={selectedTemplateId}
              onSelect={setSelectedTemplateId}
              isLoading={isLoadingTemplates}
              label="Select Study Plan Template"
            />
          </div>

          {/* Sticky Actions Container */}
          <div className="flex space-x-4 pt-4 sticky bottom-0 bg-white border-t border-slate-50 mt-4">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 py-5 text-slate-500 font-black hover:bg-slate-100 rounded-[24px] transition-colors text-[11px] uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="flex-[2] teal-gradient text-white py-5 rounded-[24px] font-black shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Cloning Roadmap...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  <span>Create Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
