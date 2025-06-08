import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { courses, getCoursesByCategory } from '../data/courses';

const categories = [
  { id: 'all', name: 'All Courses' },
  { id: 'web', name: 'Web Development' },
  { id: 'devops', name: 'DevOps' },
  { id: 'blockchain', name: 'Blockchain' },
  { id: 'web3', name: 'Web3' },
];

const CoursesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredCourses = getCoursesByCategory(activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Courses</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-2">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;