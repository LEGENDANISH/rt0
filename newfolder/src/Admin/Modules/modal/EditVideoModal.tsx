import React, { useState, useEffect } from 'react';
import { ModalLayout } from './ModalLayout';
import { InputField } from '../shared/InputField';
import { Video } from '../types/moduleTypes';

interface EditVideoModalProps {
  isOpen: boolean;
  video: Video | null;
  moduleId: string | null;
  onClose: () => void;
  onSubmit: (
    videoId: string,
    moduleId: string,
    updatedData: { title?: string; url?: string; thumbnail?: string }
  ) => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  video,
  moduleId,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnail: '',
  });

  // Reset or pre-fill form when modal opens or video changes
  useEffect(() => {
    if (isOpen && video) {
      setFormData({
        title: video.title,
        url: video.url,
        thumbnail: video.thumbnail || '',
      });
    }
  }, [isOpen, video]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        url: '',
        thumbnail: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!video || !moduleId) {
      onClose();
      return;
    }

    const { title, url, thumbnail } = formData;

    if (!title.trim() || !url.trim()) {
      alert('Title and URL are required.');
      return;
    }

    if (!isValidUrl(url)) {
      alert('Please enter a valid URL for the video.');
      return;
    }

    onSubmit(video.id, moduleId, {
      title,
      url,
      thumbnail: thumbnail || undefined,
    });

    onClose();
  };

  // Don't render if not open or data is missing
  if (!isOpen || !video || !moduleId) {
    return null;
  }

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Video
        </h2>

        <InputField
          label="Video Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <InputField
          label="Video URL"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />

        <InputField
          label="Thumbnail URL (Optional)"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Video
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};