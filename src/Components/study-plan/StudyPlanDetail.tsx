import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/studyPlanApi';
import StudyItemTable from './StudyItemTable';
import CourseSelector from './CourseSelector';
import { StudyItemRead } from '../../types/studyPlan.types';

interface StudyPlanDetailProps {
  planId: string;
  onBack: () => void;
}

const StudyPlanDetail: React.FC<StudyPlanDetailProps> = ({ planId, onBack }) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>('');

  /* ----------------------------------
   * 1. Data Fetching
   * ---------------------------------- */

  const {
    data: plan,
    isLoading: isPlanLoading,
    isError: isPlanError,
    error: planError,
  } = useQuery({
    queryKey: ['study-plan', planId],
    queryFn: () => api.fetchStudyPlanById(planId),
  });

  const {
    data: studyItems = [],
    isLoading: isItemsLoading,
  } = useQuery({
    queryKey: ['study-items', planId],
    queryFn: () => api.fetchStudyItemsByPlanId(planId),
  });

  /* ----------------------------------
   * 2. Mutations
   * ---------------------------------- */

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteStudyItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['study-items', planId] });
    },
  });

  const lockMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: StudyItemRead['status'];
    }) =>
      api.updateStudyItem(id, {
        status: status === 'locked' ? 'planned' : 'locked',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['study-items', planId] });
    },
  });

  /* ----------------------------------
   * 3. Search / Filter Logic
   * ---------------------------------- */

  const filteredItems: StudyItemRead[] = studyItems.filter(
    (item: StudyItemRead) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isGlobalLoading = isPlanLoading || isItemsLoading;

  /* ----------------------------------
   * 4. Loading / Error States
   * ---------------------------------- */

  if (isGlobalLoading) {
    return (
      <div className="p-12 animate-pulse space-y-8">
        <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
        <div className="h-96 bg-white rounded-3xl"></div>
      </div>
    );
  }

  if (isPlanError) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-xl font-bold text-rose-600">
          Failed to load roadmap
        </h3>
        <p className="text-slate-500 mt-2">
          {(planError as Error)?.message}
        </p>
        <button
          onClick={onBack}
          className="mt-6 text-teal-600 font-bold underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  /* ----------------------------------
   * 5. Main Render
   * ---------------------------------- */

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:text-teal-600 transition-colors group"
          >
            <svg
              className="w-3 h-3 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Gallery</span>
          </button>

          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {plan?.name}
            </h1>
            <span className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black uppercase rounded-full border border-teal-100">
              Editor
            </span>
          </div>

          <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">
            {plan?.description ||
              'Visualizing your academic success path.'}
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-3 block">
            Filter Roadmap
          </label>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search existing items..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
            />
            <svg
              className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-end">
          <CourseSelector studyPlanId={planId} />
        </div>
      </div>

      <StudyItemTable
        items={filteredItems}
        onDelete={(id) => deleteMutation.mutate(id)}
        onToggleLock={(item) =>
          lockMutation.mutate({
            id: item.item_id,
            status: item.status,
          })
        }
      />
    </div>
  );
};

export default StudyPlanDetail;
