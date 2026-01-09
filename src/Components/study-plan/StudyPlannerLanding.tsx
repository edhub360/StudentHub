
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/studyPlanApi';
import PlanCard from './PlanCard';
import CreatePlanModal from './CreatePlanModal';

interface StudyPlannerLandingProps {
  onSelectPlan: (id: string) => void;
}

const StudyPlannerLanding: React.FC<StudyPlannerLandingProps> = ({ onSelectPlan }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: plans = [], isLoading, isError, error } = useQuery({
    queryKey: ['study-plans'],
    queryFn: api.fetchStudyPlans
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteStudyPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
    },
    onError: (err: any) => {
      alert(`Failed to delete plan: ${err.message}`);
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this roadmap? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) {
    return (
      <div className="p-12 text-center">
        <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 max-w-lg mx-auto">
          <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h3 className="text-xl font-black text-rose-900 mb-2">Failed to load plans</h3>
          <p className="text-rose-600 mb-6 font-medium">{(error as any).message || 'An unexpected error occurred while fetching your data.'}</p>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['study-plans'] })} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors">Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">My Study Plans</h1>
          <p className="text-slate-500 mt-3 text-lg font-medium max-w-2xl leading-relaxed">Design your academic future. Track milestones, manage course loads, and visualize your path to success.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-teal-400 text-white px-10 py-5 rounded-[24px] text-[11px] font-black shadow-2xl shadow-teal-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3 uppercase tracking-widest"
        >
          <span>Create Study Plan</span>
        </button>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[40px] h-80 border border-slate-100 animate-pulse relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-50"></div>
            </div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 text-slate-200">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Your Gallery is Empty</h3>
          <p className="text-slate-400 max-w-sm font-medium leading-relaxed">It looks like you haven't started mapping your courses yet. Click the button above to launch your first roadmap.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {plans.map(plan => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              onClick={() => onSelectPlan(plan.id)}
              onDelete={(e) => { e.stopPropagation(); handleDelete(plan.id); }}
            />
          ))}
        </div>
      )}

      <CreatePlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudyPlannerLanding;
