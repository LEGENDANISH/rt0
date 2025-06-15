import React from 'react';
import { Plus } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { Video, VideoGridProps } from '../types';

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  moduleId,
  onAddVideo,
  onEditVideo,
  onDeleteVideo
}) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No videos in this module yet</p>
        <button
          onClick={() => onAddVideo(moduleId)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add First Video
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          moduleId={moduleId}
          onEdit={onEditVideo}
          onDelete={onDeleteVideo}
        />
      ))}
    </div>
  );
};