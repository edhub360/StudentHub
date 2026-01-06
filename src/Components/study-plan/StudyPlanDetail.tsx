
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/studyPlanApi';
import StudyItemTable from './StudyItemTable';
import CourseSelector from './CourseSelector';
import { DEFAULT_TERM } from '../../constants/studyPlan.constants';
import { Course, StudyItemRead } from '../../types/studyPlan.types';

interface StudyPlanDetailProps {
  planId: string;
  onBack: () => void;
}

const StudyPlanDetail: React.FC<StudyPlanDetailProps> = ({ planId, onBack }) => {
  const queryClient = useQueryClient();
  const [selectedTerm, setSelectedTerm] = useState(DEFAULT_TERM);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Data Fetching
  const { data: plan, isLoading, isError, error } = useQuery({
    queryKey: ['study-plan', planId],
    queryFn: () => api.fetchStudyPlanById(planId)
  });

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: api.fetchCourses
  });

  // 2. Mutations (Functionality)
  const addMutation = useMutation({
    mutationFn: (course: Course) => api.createStudyItem({
      termname: selectedTerm,
      course_category: course.category,
      coursecode: course.code,
      title: course.title,
      studyplanid: planId,
      duration: course.duration,
      positionindex: (plan?.studyitems?.length || 0),
      status: 'planned'
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-plan', planId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteStudyItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-plan', planId] }),
  });

  const lockMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => 
      api.updateStudyItem(id, { status: status === 'locked' ? 'planned' : 'locked' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-plan', planId] }),
  });

  // 3. Search Logic (Behavior)
  const filteredItems = plan?.studyitems?.filter((item: StudyItemRead) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.coursecode.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <div className="p-12 animate-pulse space-y-8"><div className="h-10 w-64 bg-slate-200 rounded-lg"></div><div className="h-96 bg-white rounded-3xl"></div></div>;

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:text-teal-600 transition-colors group">
            <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            <span>Back to Plans</span>
          </button>
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{plan?.name}</h1>
            <span className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black uppercase rounded-full border border-teal-100">Editor</span>
          </div>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">{plan?.description}</p>
        </div>
      </header>

      {/* Advanced Toolbar (Search + Add) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
           <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2 block">Quick Search</label>
           <div className="relative">
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Filter by title or code..."
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/10"
             />
             <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
           <CourseSelector 
              courses={courses} 
              onSelect={(c) => addMutation.mutate(c)} 
              label="Add Course to Roadmap"
              disabled={isLoadingCourses || addMutation.isPending}
           />
        </div>
      </div>

      <StudyItemTable 
        items={filteredItems} 
        onDelete={(id) => deleteMutation.mutate(id)} 
        onToggleLock={(item) => lockMutation.mutate({ id: item.itemid, status: item.status })}
      />
    </div>
  );
};

export default StudyPlanDetail;
