import React, { useState, useEffect } from 'react';
import { ModalLayout } from './ModalLayout';
import { InputField } from '../shared/InputField';

interface AddVideoModalProps {
  isOpen: boolean;
  moduleId: string | null;
  onClose: () => void;
  onSubmit: (
    moduleId: string,
    videoData: { title: string; url: string; thumbnail?: string }
  ) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  moduleId,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setUrl('');
      setThumbnail('');
    }
  }, [isOpen]);

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

    if (!moduleId) {
      onClose();
      return;
    }

    if (!title.trim() || !url.trim()) {
      alert('Title and URL are required.');
      return;
    }

    if (!isValidUrl(url)) {
      alert('Please enter a valid URL.');
      return;
    }

    onSubmit(moduleId, {
      title,
      url,
      thumbnail: thumbnail || undefined,
    });

    onClose();
  };

  if (!isOpen || !moduleId) return null;

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Video</h2>

        <InputField
          label="Video Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <InputField
          label="Video URL"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <InputField
          label="Thumbnail URL (Optional)"
          name="thumbnail"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
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
            Add Video
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};