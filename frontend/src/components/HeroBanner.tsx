import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  course: {
    id: string;
    title: string;
    image: string;
    description: string;
  };
}

const HeroBanner: React.FC<HeroBannerProps> = ({ course }) => {
  return (
    <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <div className="absolute inset-0 opacity-20">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-800/40 dark:from-gray-900/90 dark:to-gray-800/40"></div>
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Featured Course
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {course.title}
            </h1>
            <p className="text-lg text-blue-100 dark:text-gray-300 mb-8 max-w-2xl">
              {course.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition-colors duration-200"
              >
                Enroll Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm transition-colors duration-200"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;