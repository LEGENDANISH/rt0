import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
}

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Load courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 dark:text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {/* Dashboard Link */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>

          {/* Courses Link */}
          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <BookOpen className="mr-3 h-5 w-5" />
            <span>Courses</span>
          </NavLink>

         
          {/* Modules Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsCoursesExpanded(!isCoursesExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <BookOpen className="mr-3 h-5 w-5" />
                <span>Modules</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isCoursesExpanded ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {isCoursesExpanded && (
              <div className="ml-4 space-y-1">
                {loading ? (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                ) : courses.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No courses found</p>
                ) : (
                  courses.map((course) => (
                    <NavLink
                      key={course.id}
                      to={`/admin/modules/${course.id}`}
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      {course.title.length > 30
                        ? `${course.title.substring(0, 30)}...`
                        : course.title}
                    </NavLink>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex md:hidden items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 dark:text-gray-400"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;