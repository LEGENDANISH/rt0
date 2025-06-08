import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, X, BookOpenCheck } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Link to="/\" className="flex items-center">
          <img 
            src="https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Logo" 
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        <button
          onClick={onClose}
          className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            MAIN MENU
          </h3>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={onClose}
            >
              <Home className="mr-3 h-5 w-5" />
              <span className="font-medium">Home</span>
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={onClose}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              <span className="font-medium">Courses</span>
            </NavLink>
            <NavLink
              to="/my-courses"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={onClose}
            >
              <BookOpenCheck className="mr-3 h-5 w-5" />
              <span className="font-medium">My Courses</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex flex-col gap-2">
          <Link
            to="/signup"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors duration-200"
            onClick={onClose}
          >
            Signup
          </Link>
          <Link
            to="/signin"
            className="w-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 py-2 px-4 rounded-lg font-medium text-center transition-colors duration-200"
            onClick={onClose}
          >
            Login
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar