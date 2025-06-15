import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pencil, Trash2 } from 'lucide-react';
import { Video, VideoCardProps } from '../types';

export const VideoCard: React.FC<VideoCardProps> = ({ video, moduleId, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={video.thumbnail || 'https://via.placeholder.com/400x225'} 
          alt={video.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
            onClick={() => navigate(`/admin/video/${video.id}`)}
          >
            <Play className="w-4 h-4 mr-2" />
            Play
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => navigate(`/admin/video/${video.id}`)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
          >
            View Video
          </button>

          <div className="flex space-x-6">
            <button
              onClick={() => onEdit(video)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Pencil className="h-5 w-5" />
            </button>

            <button
              onClick={() => onDelete(moduleId, video.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};