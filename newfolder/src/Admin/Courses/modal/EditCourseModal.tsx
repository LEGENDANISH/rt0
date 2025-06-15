import React, { useState, useEffect } from 'react';
import ModalLayout from './ModalLayout';
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import SelectField from '../components/SelectField';
import { Course, FormData } from '../types';

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onSubmit: (courseData: Omit<FormData, 'id'>) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ course, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<FormData, 'id'>>({
    title: '',
    description: '',
    category: '',
    price: 0,
    originalprice: 0,
    thumbnail: '',
    syllabus: '',
    tags: [],
  });

  useEffect(() => {
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      originalprice: course.originalprice,
      thumbnail: course.thumbnail,
      syllabus: course.syllabus,
      tags: course.tags || [],
    });
  }, [course]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <ModalLayout onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-1"> {/* Scrollable container */}
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Edit Course</h2>
          
          {/* Responsive grid - single column on phones, two columns on tablets+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full width fields on all screens */}
            <div className="sm:col-span-2">
              <InputField 
                label="Title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="sm:col-span-2">
              <TextAreaField 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3} // Smaller on mobile
              />
            </div>
            
            {/* Half width fields on tablets+ */}
            <div>
              <SelectField 
                label="Category" 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange}
              >
                <option value="">-- Select Category --</option>
                <option value="web">Web Development</option>
                <option value="devops">DevOps</option>
                <option value="blockchain">Blockchain</option>
                <option value="web3">Web3</option>
              </SelectField>
            </div>
            
            <div>
              <InputField 
                label="Thumbnail URL" 
                name="thumbnail" 
                value={formData.thumbnail} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <InputField 
                label="Price (₹)" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleInputChange} 
                inputMode="decimal" // Better mobile keyboard
              />
            </div>
            
            <div>
              <InputField 
                label="Original Price (₹)" 
                name="originalprice" 
                type="number" 
                value={formData.originalprice} 
                onChange={handleInputChange} 
                inputMode="decimal"
              />
            </div>
            
            <div className="sm:col-span-2">
              <InputField 
                label="Syllabus URL" 
                name="syllabus" 
                value={formData.syllabus} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          {/* Responsive buttons - stacked on phones, inline on tablets+ */}
          <div className="flex flex-col xs:flex-row justify-end gap-2 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors order-2 xs:order-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors order-1 xs:order-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditCourseModal;