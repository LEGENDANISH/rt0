import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { InputField } from '../shared/InputField';
import { EditVideoModalProps } from '../types';

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