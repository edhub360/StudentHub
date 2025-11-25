export interface EdhubCourse {
  course_id: string;
  course_title: string;
  short_description: string;
  course_duration: number;
  course_complexity: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  course_image_url?: string;
  course_redirect_url?: string;
  course_credit?: number;
  rating?: number; // Optional, as not explicitly in API response but in UI
}

export interface PaginatedCourses {
  total: number;
  page: number;
  limit: number;
  items: EdhubCourse[];
}

export interface RecommendedCourse {
  id: string;
  title: string;
  provider: string;
  description: string;
  rating: number;
  url: string;
  image?: string;
}

export interface CourseQueryParams {
  q?: string;
  page?: number;
  limit?: number;
  complexity?: string;
  minduration?: number;
  maxduration?: number;
}