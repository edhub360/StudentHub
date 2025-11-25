import React from 'react';
import { Clock, Star, BarChart } from 'lucide-react';
import { EdhubCourse } from '../../types/course.types';
import Button from './Button';

interface CourseCardProps {
  course: EdhubCourse;
  onEnroll: (url: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const handleEnrollClick = () => {
    if (course.course_redirect_url) {
      onEnroll(course.course_redirect_url);
    }
  };

  // Complexity badge color logic
  const getBadgeColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const randomRating = (4 + Math.random()).toFixed(1); // Simulating rating if missing

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={course.course_image_url || `https://picsum.photos/seed/${course.course_id}/400/250`} 
          alt={course.course_title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getBadgeColor(course.course_complexity)}`}>
            {course.course_complexity}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-textMain mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.course_title}
        </h3>
        
        <p className="text-textSub text-sm mb-4 line-clamp-3 flex-grow">
          {course.short_description}
        </p>

        <div className="flex items-center justify-between text-sm text-textSub mb-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-primary" />
            <span>{course.course_duration} weeks</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-textMain">{course.rating || randomRating}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button variant="gradient" fullWidth onClick={handleEnrollClick}>
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;