import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { InputField } from '../shared/InputField';

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}
export const AddModuleModal: React.FC<AddModuleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
    onClose();
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Module</h2>
        
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
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Module
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};