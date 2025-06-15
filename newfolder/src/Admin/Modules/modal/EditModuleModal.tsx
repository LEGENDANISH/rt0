import React, { useState, useEffect } from 'react';
import { ModalLayout } from './ModalLayout';
import { InputField } from '../shared/InputField';
import { Module } from '../types/moduleTypes';

interface EditModuleModalProps {
  isOpen: boolean;
  module: Module | null;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export const EditModuleModal: React.FC<EditModuleModalProps> = ({ 
  isOpen, 
  module, 
  onClose, 
  onSubmit 
}) => {
  const [title, setTitle] = useState('');

  // Reset or update title when modal opens or module changes
  useEffect(() => {
    if (module?.title) {
      setTitle(module.title);
    }
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!module) {
      onClose();
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert('Module title cannot be empty.');
      return;
    }

    if (trimmedTitle === module.title) {
      alert('No changes detected. Please edit the title before submitting.');
      return;
    }

    onSubmit(trimmedTitle);
    onClose(); // Close modal after successful submit
  };

  if (!isOpen || !module) return null;

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Module</h2>

        <InputField 
          label="Module Title" 
          name="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />

        <div className="flex justify-end space-x-3 mt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};