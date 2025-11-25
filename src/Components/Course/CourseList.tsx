import React from 'react';
import { EdhubCourse, RecommendedCourse } from '../../types/course.types';
import CourseCard from './CourseCard';
import RecommendedCourseCard from './RecommendedCourseCard';

interface CourseListProps {
  courses: EdhubCourse[];
  recommendedCourses?: RecommendedCourse[];
  isLoading: boolean;
  showRecommended: boolean;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  recommendedCourses = [], 
  isLoading, 
  showRecommended 
}) => {
  
  const handleEnroll = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white h-[450px] rounded-lg shadow-sm border border-border">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-5 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded mt-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (showRecommended) {
    return (
      <div className="space-y-8">
        <div className="text-center py-10 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-textMain mb-2">Recommended Courses</h2>
          <p className="text-textSub max-w-lg mx-auto">
            We couldn't find matches in our catalog, but here are some highly-rated courses from our partner platforms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCourses.map((course, idx) => (
            <RecommendedCourseCard key={course.id || idx} course={course} />
          ))}
        </div>
        
        {/* Helper text/link to clear search */}
        <div className="text-center mt-6">
           <p className="text-sm text-textSub">
             Looking for something else? Try adjusting your search filters.
           </p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
        <div className="text-center py-20">
            <h3 className="text-lg font-medium text-textMain">No courses found.</h3>
            <p className="text-textSub">Try adjusting your filters or search terms.</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard 
          key={course.course_id} 
          course={course} 
          onEnroll={handleEnroll} 
        />
      ))}
    </div>
  );
};

export default CourseList;