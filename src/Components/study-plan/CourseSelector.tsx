
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/studyPlanApi';
import { CourseSearchResult } from '../../types/studyPlan.types';

interface CourseSelectorProps {
  studyPlanId: string;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ studyPlanId }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Search Query
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses-search', searchTerm],
    queryFn: () => api.fetchCoursesBySearch(searchTerm),
    enabled: searchTerm.length > 1,
  });

  // Add Item Mutation
  const addMutation = useMutation({
    mutationFn: (course: CourseSearchResult) => api.addStudyItem({
      studyplanid: studyPlanId,
      coursecode: course.course_code,
      title: course.course_title,
      course_category: course.course_category,
      duration: course.course_duration,
      termname: "FALL 2025", // Default target term for quick adds
      status: 'planned',
      positionindex: 99
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-items', studyPlanId] });
      queryClient.invalidateQueries({ queryKey: ['study-plan', studyPlanId] });
      setSearchTerm("");
      setIsOpen(false);
    },
    onError: (err: any) => {
      alert(`Failed to add course: ${err.message}`);
    }
  });

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col" ref={wrapperRef}>
      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2 ml-1">Add Course To Plan</label>
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search by code or title (e.g. CS101)..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all min-w-[300px]"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Results */}
        {isOpen && searchTerm.length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="max-h-[300px] overflow-y-auto">
              {courses.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm font-medium italic">
                  No courses found for "{searchTerm}"
                </div>
              ) : (
                courses.map((course) => (
                  <button
                    key={course.course_id}
                    onClick={() => addMutation.mutate(course)}
                    disabled={addMutation.isPending}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 text-left transition-colors group border-b border-slate-50 last:border-0 disabled:opacity-50"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {course.course_code}
                        </span>
                        <span className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                          {course.course_title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                        {course.course_category} • {course.course_duration} Units
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-teal-500 text-white p-2 rounded-lg shadow-lg shadow-teal-500/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="bg-slate-50 p-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center border-t border-slate-100">
              {courses.length} matches found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSelector;
