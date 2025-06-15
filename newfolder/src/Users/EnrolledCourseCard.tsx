import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

interface EnrolledCourseCardProps {
  course: any;
  onContinue: () => void;
}

export const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course, onContinue }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 animate-fade-in-up">
      <div className="flex">
        <div className="w-32 h-32 flex-shrink-0">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
          <p className="text-gray-400 text-sm mb-3">by {course.instructor}</p>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Last accessed: {course.lastAccessed}</span>
            <button
              onClick={onContinue}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};