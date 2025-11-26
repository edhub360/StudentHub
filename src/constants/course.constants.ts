import { RecommendedCourse, EdhubCourse } from '../types/course.types';

export const API_BASE_URL = 'https://courses-backend-91248372939.us-central1.run.app';

export const COMPLEXITY_OPTIONS = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
];

export const MOCK_COURSES: EdhubCourse[] = [
  {
    course_id: 'c1',
    course_title: 'Advanced Mathematics',
    short_description: 'Master calculus, linear algebra, and advanced mathematical concepts with AI-powered assistance.',
    course_duration: 12,
    course_complexity: 'Advanced',
    course_image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    course_redirect_url: 'https://example.com/math',
    rating: 4.8
  },
  {
    course_id: 'c2',
    course_title: 'Physics Fundamentals',
    short_description: 'Explore the laws of physics through interactive simulations and AI-guided problem solving.',
    course_duration: 10,
    course_complexity: 'Intermediate',
    course_image_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800',
    course_redirect_url: 'https://example.com/physics',
    rating: 4.8
  },
  {
    course_id: 'c3',
    course_title: 'Chemistry Lab Mastery',
    short_description: 'Learn chemistry concepts and lab techniques with virtual experiments and AI tutoring.',
    course_duration: 8,
    course_complexity: 'Beginner',
    course_image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    course_redirect_url: 'https://example.com/chemistry',
    rating: 4.8
  },
  {
    course_id: 'c4',
    course_title: 'Introduction to AI Ethics',
    short_description: 'Understand the ethical implications of artificial intelligence in modern society.',
    course_duration: 4,
    course_complexity: 'Beginner',
    course_image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    course_redirect_url: 'https://example.com/ai-ethics',
    rating: 4.9
  },
  {
    course_id: 'c5',
    course_title: 'Data Visualization with D3',
    short_description: 'Create stunning interactive data visualizations using D3.js and modern web standards.',
    course_duration: 6,
    course_complexity: 'Intermediate',
    course_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    course_redirect_url: 'https://example.com/d3',
    rating: 4.7
  },
  {
    course_id: 'c6',
    course_title: 'Quantum Computing 101',
    short_description: 'Dive into the weird world of qubits and superposition.',
    course_duration: 14,
    course_complexity: 'Advanced',
    course_image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    course_redirect_url: 'https://example.com/quantum',
    rating: 5.0
  }
];

export const RECOMMENDED_COURSES: RecommendedCourse[] = [
  {
    id: 'rec_1',
    title: 'Machine Learning Specialization',
    provider: 'Coursera',
    description: 'Learn the fundamentals of machine learning with hands-on projects and real-world applications.',
    rating: 4.9,
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
  },
  {
    id: 'rec_2',
    title: 'Data Science MicroMasters',
    provider: 'edX',
    description: 'Comprehensive program covering statistics, programming, and data analysis techniques.',
    rating: 4.7,
    url: 'https://www.edx.org/',
  },
  {
    id: 'rec_3',
    title: 'Full Stack Web Development',
    provider: 'Udacity',
    description: 'Build modern web applications using React, Node.js, and cloud technologies.',
    rating: 4.6,
    url: 'https://www.udacity.com/',
  }
];