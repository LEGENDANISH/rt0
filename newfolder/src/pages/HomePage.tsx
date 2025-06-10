import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';

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
}

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
        setCourses(data);
      } catch (err: any) {
        console.error('Failed to load courses:', err.message);
        setError('Could not load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const featuredCourses = courses.filter((c) => c.featured).slice(0, 3);
  const latestCourses = courses.slice(0, 6); // First 6 regular courses

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Courses Banner */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Featured Courses
        </h2>
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
  {latestCourses.map((course) => (
    <Link
      key={course.id}
      to={`/courses/${course.id}`}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </Link>
  ))}
</div>
        </div>
      </section>

      {/* Latest Courses Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Courses</h2>
          <Link
            to="/courses"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Explore All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {latestCourses.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No courses found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 -mx-4 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Courses?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Learn from industry experts and get hands-on experience with the latest technologies
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Project-Based Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build real-world projects that you can showcase in your portfolio
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0 -3.332.477 -4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our courses cover all aspects of modern web development
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Community Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a community of developers to learn and grow together
              </p>
            </div>
          </div>

          <Link
            to="/courses"
            className="mt-10 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200"
          >
            Find Your Course
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

// Helper Component: CourseCard
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {course.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900 dark:text-white">
            ₹{course.price.toFixed(2)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 line-through text-xs">
            ₹{course.originalprice.toFixed(2)}
          </span>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="mt-4 block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

// Skeleton Loader
const SkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Featured Courses
        </h2>
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 animate-pulse">
          <div className="flex space-x-4 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full md:w-1/3 flex-shrink-0">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Courses</h2>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <span>Explore All</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-full h-32 bg-gray-300 dark:bg-gray-600"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};