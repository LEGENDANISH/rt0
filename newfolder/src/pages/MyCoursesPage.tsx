import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  imageUrl: string;
  progress?: number;
  lastWatched?: string;
}

const MyCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mycourses', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust auth as needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

// Extracted CourseCard Component for clarity
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const progress = course.progress || 0;
  const lastWatched = course.lastWatched || 'Not started';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Link
            to={`/my-courses/modules/${course.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Continue Learning
          </Link>
        </div>
      </div>

      <div className="p-4">
        <Link
          to={`/my-courses/${course.id}`}
          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          {course.title}
        </Link>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>Last watched: {lastWatched}</span>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;