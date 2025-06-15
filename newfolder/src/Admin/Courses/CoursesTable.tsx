import React from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Course } from './types';

interface CourseTableProps {
  courses: Course[];
  expandedCourse: string | null;
  onToggleExpand: (courseId: string) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ 
  courses, 
  expandedCourse, 
  onToggleExpand, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Category</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Price</th>
            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {courses.map((course) => (
            <React.Fragment key={course.id}>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {course.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                  {course.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ₹{course.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onToggleExpand(course.id)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <ChevronDown size={20} />
                  </button>
                  <button
                    onClick={() => onEdit(course)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(course)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
              {expandedCourse === course.id && (
                <tr>
                  <td colSpan={4} className="p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                        <p className="text-sm text-gray-900 dark:text-white">{course.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Syllabus</h4>
                        <p className="text-sm text-gray-900 dark:text-white">{course.syllabus}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(course.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;