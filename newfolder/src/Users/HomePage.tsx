import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

// Define Types
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  thumbnail: string;
  syllabus: string;
  tags?: string[];
  featured: boolean;
  startDate?: string; // Optional, as it wasn't in the original interface
}

// SkeletonCard Component (Adapted from LatestCoursesPage)
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="h-32 sm:h-40 bg-gray-300"></div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-4">
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

// CourseCard Component (Reused from provided code)
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-28 sm:h-32 object-cover"
      />
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-md font-semibold text-gray-900 dark:text-white line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {course.description}
        </p>
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
            ₹{course.price.toFixed(2)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 line-through text-xs">
            ₹{course.originalPrice}
          </span>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="mt-3 sm:mt-4 block text-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api/courses';
  const token = localStorage.getItem('token');

  // Load courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.courses || [];

        // Sort by startDate (if available) or id descending, take top 3
        const sortedCourses = data
          .sort((a: Course, b: Course) => {
            if (a.startDate && b.startDate) {
              return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            }
            // Fallback to id if startDate is unavailable
            return parseInt(b.id, 10) - parseInt(a.id, 10);
          })
          .slice(0, 3);

        setCourses(sortedCourses);
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
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Latest Courses
        </h1>
        <Link
          to="/courses"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm sm:text-base"
        >
          Explore All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {/* Loading State with Skeleton Cards */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-red-500 text-sm sm:text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <h3 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Check back later for new courses.
          </p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add custom animation for fade-in effect
const styles = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default HomePage;