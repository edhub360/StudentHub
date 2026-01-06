
import React from 'react';
import { Course } from '../../types/studyPlan.types';

interface CourseSelectorProps {
  courses: Course[];
  onSelect: (course: Course) => void;
  label?: string;
  disabled?: boolean;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ courses, onSelect, label = "Select Course", disabled }) => {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <select 
          disabled={disabled}
          onChange={(e) => {
            const course = courses.find(c => c.id === e.target.value);
            if (course) onSelect(course);
            e.target.value = ""; 
          }}
          defaultValue=""
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="" disabled>Choose a course from the list...</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title} ({course.units} Units)
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;
