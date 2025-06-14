import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import axios from 'axios';

// Define Types
interface Course {
  id: string;
  title: string;
  description: string;
  fullPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  startDate: string;
  tags: string[];
  category: 'web' | 'devops' | 'blockchain' | 'web3';
  featured: boolean;
  syllabus: string;
}

const categories = [
  { id: 'all', name: 'All Courses' },
  { id: 'web', name: 'Web Development' },
  { id: 'devops', name: 'DevOps' },
  { id: 'blockchain', name: 'Blockchain' },
  { id: 'web3', name: 'Web3' },
];

// SkeletonCard Component (Inline)
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="h-40 bg-gray-300"></div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 bg-gray-300 rounded w-16"></div>
          <div className="h-5 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api/courses';

  // Load courses on mount or when category changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          activeCategory === 'all'
            ? API_URL
            : `${API_URL}?category=${activeCategory}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle both array and object responses
        const data = Array.isArray(res.data) ? res.data : res.data.courses || [];

        setCourses(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load courses:', err.message);
        setError('Could not load courses. Please try again later.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Courses</h1>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State with Skeleton Cards */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-2">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;