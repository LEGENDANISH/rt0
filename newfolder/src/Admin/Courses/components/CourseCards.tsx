import React from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Course } from '../types';

interface CourseCardsProps {
  courses: Course[];
  expandedCourse: string | null;
  onToggleExpand: (courseId: string) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseCards: React.FC<CourseCardsProps> = ({ 
  courses, 
  expandedCourse, 
  onToggleExpand, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
      {courses.map((course) => (
        <div key={course.id} className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{course.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{course.category}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onToggleExpand(course.id)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => onEdit(course)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(course)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {expandedCourse === course.id && (
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Syllabus:</strong> {course.syllabus}</p>
              <p><strong>Price:</strong> ₹{course.price.toFixed(2)}</p>
              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
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
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseCards;