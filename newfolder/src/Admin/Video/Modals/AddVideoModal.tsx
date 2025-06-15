import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { InputField } from '../shared/InputField';
import { AddVideoModalProps } from '../types';

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