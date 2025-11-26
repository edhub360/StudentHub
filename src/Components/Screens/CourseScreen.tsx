import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { fetchCourses } from '../../services/courseApi';
import CourseList from '../Course/CourseList';
import { EdhubCourse, RecommendedCourse } from '../../types/course.types';
import { RECOMMENDED_COURSES, COMPLEXITY_OPTIONS } from '../../constants/course.constants';
import Button from '../Course/Button';

const CourseScreen: React.FC = () => {
  // State
  const [courses, setCourses] = useState<EdhubCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [complexity, setComplexity] = useState('');
  
  // Pagination (basic implementation)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Data Fetching
  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCourses({
        q: debouncedSearch,
        complexity: complexity || undefined,
        page,
        limit
      });
      
      setCourses(data.items);
      setTotalPages(Math.ceil(data.total / limit));
      
    } catch (err) {
      console.error(err);
      // If API fails, we treat it as no results found to show recommended courses
      // Or we could set a specific error state. 
      // For this requirement: "If no Edhub360 course matches... display static Recommended Courses"
      // Failing to fetch acts similarly to finding nothing.
      setCourses([]); 
      // Optional: setError("Failed to connect to course server."); 
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, complexity, page]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const showRecommended = !isLoading && courses.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-textMain mb-4">Discover Courses</h1>
        <p className="text-lg text-textSub">
          Explore our comprehensive course catalog and find the perfect learning path for you.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border mb-10 sticky top-20 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
              placeholder="Search for courses (e.g., Data Science)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-shrink-0 w-full md:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={complexity}
              onChange={(e) => {
                setComplexity(e.target.value);
                setPage(1);
              }}
              className="block w-full pl-10 pr-10 py-3 text-base border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg transition duration-150 ease-in-out appearance-none"
            >
              {COMPLEXITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md flex items-center">
            <AlertCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Content Area */}
      <CourseList 
        courses={courses}
        recommendedCourses={RECOMMENDED_COURSES}
        isLoading={isLoading}
        showRecommended={showRecommended}
      />

      {/* Pagination */}
      {!showRecommended && courses.length > 0 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-textSub font-medium">
            Page {page}
          </span>
          <Button 
            variant="outline"
            onClick={() => setPage(p => p + 1)} // Assuming there are more pages if current isn't empty, logic can be stricter
            disabled={courses.length < limit || isLoading}
          >
            Next
          </Button>
        </div>
      )}
      
      {showRecommended && (
         <div className="mt-8 text-center">
            <button 
                onClick={() => { setSearchQuery(''); setComplexity(''); }}
                className="text-primary hover:text-cyan-700 font-medium transition-colors"
            >
                ← Back to Edhub360 Courses
            </button>
         </div>
      )}
    </div>
  );
};

export default CourseScreen;