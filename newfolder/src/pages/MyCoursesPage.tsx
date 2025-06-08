import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';

const subscribedCourses = [
  {
    id: '1',
    title: 'Complete Web Development + Devops + Blockchain Cohort',
    progress: 45,
    lastWatched: 'Introduction to React Hooks',
    thumbnail: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: 'Frontend Development Masterclass',
    progress: 75,
    lastWatched: 'Advanced TypeScript Patterns',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const MyCoursesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscribedCourses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Link
                  to={`/my-courses/${course.id}`}
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
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>Last watched: {course.lastWatched}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCoursesPage;