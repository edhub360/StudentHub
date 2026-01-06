
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Course } from '../../types/studyPlan.types';
import * as api from '../../services/studyPlanApi';
import CourseSelector from './CourseSelector';
import { DEFAULT_TERM } from '../../constants/studyPlan.constants';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: api.fetchCourses,
    enabled: isOpen
  });

  const mutation = useMutation({
    mutationFn: async () => {
      // 1. Create the plan
      const plan = await api.createStudyPlan({ name, description });
      
      // 2. Map selected courses to StudyItems (Fall 2025, Planned)
      const itemPromises = selectedCourses.map((course, index) => 
        api.createStudyItem({
          studyplanid: plan.id,
          coursecode: course.code,
          title: course.title,
          course_category: course.category,
          duration: course.duration,
          termname: DEFAULT_TERM,
          status: 'planned',
          positionindex: index
        })
      );
      
      await Promise.all(itemPromises);
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      handleClose();
    },
    onError: (error: Error) => {
      alert(`Error creating plan: ${error.message}`);
    }
  });

  const handleAddCourse = (course: Course) => {
    if (!selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeCourse = (id: string) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedCourses([]);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose}></div>
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl relative animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20">
        <div className="teal-gradient px-10 py-10 text-white relative">
           <h2 className="text-3xl font-black tracking-tight mb-2">Create New Study Plan</h2>
           <p className="text-teal-50 text-sm font-medium opacity-80 italic">Define your roadmap and select your core academic curriculum.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Plan Meta */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Plan Name</label>
              <input 
                required
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. BS in Computer Science - 2025"
                className="bg-slate-50 border border-slate-200 rounded-[20px] px-6 py-5 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-semibold text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-[20px] px-6 py-5 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-medium h-24 resize-none text-slate-600 placeholder:text-slate-400"
                placeholder="Briefly summarize the goal of this study roadmap..."
              />
            </div>
          </div>

          {/* Multi-Course Selection Area */}
          <div className="space-y-6">
            <CourseSelector 
              courses={courses} 
              onSelect={handleAddCourse} 
              label="Select Courses to Add"
              disabled={isLoadingCourses}
            />

            {selectedCourses.length > 0 && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Added to Roadmap ({selectedCourses.length})</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCourses.map(c => (
                    <div key={c.id} className="bg-teal-50 border border-teal-100 rounded-xl pl-4 pr-2 py-2.5 flex items-center justify-between group animate-in fade-in slide-in-from-left-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-teal-700 leading-none mb-0.5">{c.code}</span>
                        <span className="text-[9px] font-medium text-teal-600 truncate max-w-[120px]">{c.title}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeCourse(c.id)}
                        className="text-teal-400 hover:text-teal-600 p-1.5 rounded-lg transition-colors ml-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 sticky bottom-0 bg-white border-t border-slate-50">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 py-5 text-slate-500 font-black hover:bg-slate-100 rounded-[20px] transition-colors text-[11px] uppercase tracking-widest"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="flex-[2] teal-gradient text-white py-5 rounded-[20px] font-black shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Syncing Roadmap...' : 'Create Study Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
