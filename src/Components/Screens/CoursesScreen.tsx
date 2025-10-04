import React from 'react';
import { Search, Star, BookOpen, ExternalLink } from 'lucide-react';

export interface CourseType {
  id: string | number;
  title: string;
  description: string;
  duration?: string;
  level?: string;
  rating?: number;
  image?: string;
  platform?: string;
  platformLogo?: string | JSX.Element;
  url?: string;
}

interface CoursesScreenProps {
  courseSearchQuery: string;
  showRecommendations: boolean;
  filteredCourses: CourseType[];
  externalRecommendations: CourseType[];
  setCourseSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowRecommendations: React.Dispatch<React.SetStateAction<boolean>>;
  handleCourseSearch: (query: string) => void;
}

const CoursesScreen: React.FC<CoursesScreenProps> = ({
  courseSearchQuery,
  showRecommendations,
  filteredCourses,
  externalRecommendations,
  setCourseSearchQuery,
  setShowRecommendations,
  handleCourseSearch,
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Courses</h1>
        <p className="text-gray-600 mb-6">
          Explore our comprehensive course catalog and find the perfect learning path for you.
        </p>

        {/* Course Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for courses or ask for recommendations..."
            value={courseSearchQuery}
            onChange={(e) => handleCourseSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Edhub360 Courses */}
      {!showRecommendations && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {courseSearchQuery ? 'Search Results' : 'Edhub360 Courses'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {course.level}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Duration: {course.duration}</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{course.rating || 4.8}</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02]">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && courseSearchQuery && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try searching with different keywords or check our recommendations below.</p>
            </div>
          )}
        </div>
      )}

      {/* External Course Recommendations */}
      {showRecommendations && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Recommended Courses</h2>
            <p className="text-gray-600">
              We couldn't find "{courseSearchQuery}" in our catalog, but here are some highly-rated courses from our partner platforms:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalRecommendations.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{course.platformLogo}</span>
                      <span className="text-sm font-medium text-gray-600">{course.platform}</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {course.description}
                  </p>
                  <button
                    onClick={() => window.open(course.url, '_blank')}
                    className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
                  >
                    View Course
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setCourseSearchQuery('');
                setShowRecommendations(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Edhub360 Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesScreen;
