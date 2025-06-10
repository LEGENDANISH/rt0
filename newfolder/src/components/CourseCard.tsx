import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Star, Users } from 'lucide-react';
import type { Course } from '../data/courses';

interface CourseCardProps {
  course: Course;
  
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Calculate discount percentage if not provided
  const discountPercentage = course.discountPercentage || 
    Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-700">
      {/* Thumbnail Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-1.5 px-3 rounded-full text-xs shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Featured Badge */}
        {course.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold py-1 px-2 rounded-full text-xs shadow-lg flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white py-1 px-2 rounded-md text-xs font-medium">
          {course.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Course Info */}
        <div className="space-y-2 mb-4">
          {/* Syllabus */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{course.syllabus}</span>
          </div>

          {/* Start Date */}
          {course.startDate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>Starts {course.startDate}</span>
            </div>
          )}

          {/* Students Count (if available) */}
          {course.studentsCount && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Users className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>{course.studentsCount.toLocaleString()} students</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-md"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{course.price.toLocaleString()}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₹{course.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Rating (if available) */}
          {course.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {course.rating}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/courses/${course.id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          View Course Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;