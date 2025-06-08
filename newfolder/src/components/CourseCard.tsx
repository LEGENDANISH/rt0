import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../data/courses';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-yellow-400 text-black font-bold py-1 px-2 rounded-md text-sm">
          {course.discountPercentage}% off
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 h-16">
          {course.description}
        </p>
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Complete syllabus – {course.syllabus}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Starts {course.startDate}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">₹{course.discountedPrice.toLocaleString()}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">₹{course.fullPrice.toLocaleString()}</span>
          </div>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="mt-4 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;