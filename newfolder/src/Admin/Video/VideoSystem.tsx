import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pencil, Trash2, Plus, X } from 'lucide-react';

// Define Types
export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

// Video Card Component
interface VideoCardProps {
  video: Video;
  moduleId: string;
  onEdit: (video: Video) => void;
  onDelete: (moduleId: string, videoId: string) => void;
}

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

// Video Grid Component
interface VideoGridProps {
  videos: Video[];
  moduleId: string;
  onAddVideo: (moduleId: string) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (moduleId: string, videoId: string) => void;
}

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

// Add Video Modal
interface AddVideoModalProps {
  moduleId: string;
  onClose: () => void;
  onSubmit: (moduleId: string, videoData: { title: string; url: string; thumbnail?: string }) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ moduleId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;
    onSubmit(moduleId, formData);
    setFormData({ title: '', url: '', thumbnail: '' });
    onClose();
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Video</h2>
        <InputField label="Video Title" name="title" value={formData.title} onChange={handleChange} required />
        <InputField label="Video URL" name="url" value={formData.url} onChange={handleChange} required />
        <InputField label="Thumbnail URL (optional)" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Video
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

// Edit Video Modal
interface EditVideoModalProps {
  video: Video;
  moduleId: string;
  onClose: () => void;
  onSubmit: (videoId: string, moduleId: string, data: { title: string; url: string; thumbnail?: string }) => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({ video, moduleId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: video.title,
    url: video.url,
    thumbnail: video.thumbnail || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    onSubmit(video.id, moduleId, formData);
    onClose();
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Video</h2>
        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <InputField label="URL" name="url" value={formData.url} onChange={handleChange} required />
        <InputField label="Thumbnail URL (optional)" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

// Shared Components
const ModalLayout: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}> = ({ label, name, value, onChange, required = false, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
    />
  </div>
);