import React, { useState } from 'react';
import ModalLayout from './ModalLayout';
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import { FormData } from '../types';

interface AddCourseModalProps {
  onClose: () => void;
  onSubmit: (courseData: {
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    originalprice: number;
  }) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    originalprice: 0,
    thumbnail: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'price' | 'originalprice'
  ) => {
    const value = parseFloat(e.target.value) ;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      price: formData.price,
      originalprice: formData.originalprice
    });
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Add New Course
        </h2>
        
        <InputField 
          label="Title" 
          name="title" 
          value={formData.title} 
          onChange={handleInputChange} 
          
        />
        
        <TextAreaField 
          label="Description" 
          name="description" 
          value={formData.description} 
          onChange={handleInputChange} 
          
        />
        
        <InputField 
          label="Price" 
          name="price" 
          type="number" 
          value={formData.price} 
          onChange={(e) => handleNumberChange(e, 'price')}
                  />
        
        <InputField 
          label="Original Price" 
          name="originalprice" 
          type="number" 
          value={formData.originalprice} 
          onChange={(e) => handleNumberChange(e, 'originalprice')}
          
        />
        
        <InputField 
          label="Thumbnail URL" 
          name="thumbnail" 
          value={formData.thumbnail} 
          onChange={handleInputChange} 
          
        />
        
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Course
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default AddCourseModal;