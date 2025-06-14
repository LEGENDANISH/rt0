import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  moduleId: number;
}

interface Module {
  id: number;
  title: string;
  courseId: number;
  videos: Video[];
}

const CourseModulePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(courseId);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/modules/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // For JWT auth
          }
        });

        console.log(response);
        setModules(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong while loading modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Course Modules</h1>

      {modules.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No modules found for this course.</p>
      ) : (
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
                  {module.videos.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No videos available in this module.</p>
                  ) : (
                    module.videos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <Link to={`/my-courses/${courseId}/video/${video.id}`} className="flex p-4">
                          <div className="relative w-48 h-32 flex-shrink-0">
                            <img
                              src={video.thumbnail }
                              alt={video.title}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-thumbnail.jpg';
                              }}
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
                            </div>

                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Video</span>
                            </div>
                            
                            {video.url && (
                              <div className="mt-1 text-xs text-blue-500 dark:text-blue-400">
                                YouTube Video
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseModulePage;