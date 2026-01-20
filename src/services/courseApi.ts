import axios from 'axios';
import { API_BASE_URL, MOCK_COURSES } from '../constants/course.constants';
import { CourseQueryParams, PaginatedCourses } from '../types/course.types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCourses = async (params: CourseQueryParams): Promise<PaginatedCourses> => {
  try {
    const response = await apiClient.get<PaginatedCourses>('/courses/', { params });
    return response.data;
  } catch (error) {
    // Only warn in development or if critical; logic ensures app continuity
    console.log('Backend API unavailable or Network Error. Serving mock data.');
    
    // Simulate server-side processing with mock data
    let filtered = [...MOCK_COURSES];

    // Filter by Search Query
    if (params.q) {
      const q = (params.q || '').toLowerCase();
      filtered = filtered.filter(c =>
        (c.course_title || '').toLowerCase().includes(q) ||
        (c.short_description || '').toLowerCase().includes(q)
      );
    }

    // Filter by Complexity
    if (params.complexity) {
      const complexity = (params.complexity || '').toLowerCase();
      filtered = filtered.filter(
        c => (c.course_complexity || '').toLowerCase() === complexity
      );
    }

    // Filter by Duration
    if (params.minduration) {
      filtered = filtered.filter(c => c.course_duration >= (params.minduration as number));
    }
    if (params.maxduration) {
      filtered = filtered.filter(c => c.course_duration <= (params.maxduration as number));
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filtered.slice(startIndex, endIndex);

    // Simulate network latency for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      total: filtered.length,
      page,
      limit,
      items
    };
  }
};