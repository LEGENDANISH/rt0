import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Clock, CheckCircle, ChevronDown } from 'lucide-react';

const modules = [
  {
    id: '1',
    title: 'Getting Started',
    videos: [
      {
        id: 'v1',
        title: 'Introduction to the Course',
        duration: '10:15',
        completed: true,
        thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        id: 'v2',
        title: 'Setting Up Your Development Environment',
        duration: '15:30',
        completed: true,
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
    ],
  },
  {
    id: '2',
    title: 'React Fundamentals',
    videos: [
      {
        id: 'v3',
        title: 'Introduction to React Hooks',
        duration: '20:45',
        completed: false,
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        id: 'v4',
        title: 'State and Props Deep Dive',
        duration: '25:10',
        completed: false,
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
    ],
  },
];

const CourseModulePage: React.FC = () => {
  const { courseId } = useParams();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Course Modules</h1>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {module.title}
              </h2>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  expandedModule === module.id ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedModule === module.id && (
              <div className="px-6 pb-4 space-y-4">
                {module.videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Link to={`/my-courses/${courseId}/video/${video.id}`} className="flex p-4">
                      <div className="relative w-48 h-32 flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {video.title}
                          </h3>
                          {video.completed && (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModulePage;