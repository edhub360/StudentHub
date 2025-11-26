import React from 'react';
import { ExternalLink, Star, Award } from 'lucide-react';
import { RecommendedCourse } from '../../types/course.types';

interface RecommendedCourseCardProps {
  course: RecommendedCourse;
}

const RecommendedCourseCard: React.FC<RecommendedCourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-teal-400"></div>
      
      <div className="flex items-center gap-2 mb-3">
        <Award className="text-primary w-5 h-5" />
        <span className="text-sm font-semibold text-textSub uppercase tracking-wider">{course.provider}</span>
      </div>

      <h3 className="text-lg font-bold text-textMain mb-2">{course.title}</h3>
      
      <p className="text-textSub text-sm mb-4 flex-grow">{course.description}</p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-textMain">{course.rating}</span>
        </div>
        
        <a 
          href={course.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-cyan-700 transition-colors"
        >
          View Course
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default RecommendedCourseCard;