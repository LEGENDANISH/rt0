import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, X } from 'lucide-react';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  syllabus: string;
  tags?: string[];
}

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    category: '',
    price: 0,
    thumbnail: '',
    syllabus: '',
    tags: [],
  });

  const API_URL = 'http://localhost:5000/api/courses';

  // Load token from localStorage
  const token = localStorage.getItem('token');

  // Fetch courses from backend
 const fetchCourses = async () => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.courses || [];

    setCourses(data);
  } catch (err) {
    console.error('Failed to fetch courses:', err);
    setCourses([]);
    alert('Failed to load courses');
  }
};
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchCourses().finally(() => setLoading(false));
}, []);

if (loading) {
  return <p className="text-center py-4">Loading courses...</p>;
}

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      thumbnail: course.thumbnail,
      syllabus: course.syllabus,
      tags: course.tags || [],
    });
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (course: Course) => {
    setCurrentCourse(course);
    setIsDeleteConfirmOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
    title: formData.title,
    description: formData.description,
    thumbnail: formData.thumbnail,
    price: parseFloat(formData.price as any),  };
  console.log(payload);  
  try {
    const res = await axios.post(API_URL, payload, {

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    setCourses([...courses, res.data]);
    setIsAddModalOpen(false);

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      price: 0,
      thumbnail: '',
      syllabus: '',
      tags: [],
    });

  } catch (err: any) {
    console.error('Error adding course:', err.response?.data || err.message);
  }
};

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) return;
console.log(formData)
    try {
      const res = await axios.put(`${API_URL}/${currentCourse.id}`, formData, {
  headers: { Authorization: `Bearer ${token}` },
});
      setCourses(courses.map((c) => (c.id === currentCourse.id ? res.data : c)));
      setIsEditModalOpen(false);
      setCurrentCourse(null);
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!currentCourse) return;

    try {
      await axios.delete(`${API_URL}/${currentCourse.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleteConfirmOpen(false);
      setCurrentCourse(null);
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Course
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Price</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {courses.map((course) => (
    <React.Fragment key={course.id}>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
          {course.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
          {course.category}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          ₹{course.price.toFixed(2)} {/* ✅ Correct field + formatting */}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <button
            onClick={() => toggleCourseExpand(course.id)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronDown size={20} />
          </button>
          <button
            onClick={() => openEditModal(course)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => openDeleteConfirm(course)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={20} />
          </button>
        </td>
      </tr>
      {expandedCourse === course.id && (
        <tr>
          <td colSpan={4} className="p-4 bg-gray-50 dark:bg-gray-700/50">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                <p className="text-sm text-gray-900 dark:text-white">{course.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Syllabus</h4>
                <p className="text-sm text-gray-900 dark:text-white">{course.syllabus}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(course.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <AddCourseModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCourse}
          formData={formData}
          onChange={handleInputChange}
        />
      )}

      {/* Edit Course Modal */}
      {isEditModalOpen && currentCourse && (
        <EditCourseModal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCourse}
          formData={formData}
          onChange={handleInputChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && currentCourse && (
        <DeleteCourseModal
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDeleteCourse}
          courseTitle={currentCourse.title}
        />
      )}
    </div>
  );
};

// --- Subcomponents ---

interface AddCourseModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  onChange: (e: React.ChangeEvent<any>) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ onClose, onSubmit, formData, onChange }) => {
  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Course</h2>
        <InputField label="Title" name="title" value={formData.title} onChange={onChange} />
        <TextAreaField label="Description" name="description" value={formData.description} onChange={onChange} />
        <SelectField label="Category" name="category" value={formData.category} onChange={onChange}>
          <option value="">-- Select Category --</option>
          <option value="web">Web Development</option>
          <option value="devops">DevOps</option>
          <option value="blockchain">Blockchain</option>
          <option value="web3">Web3</option>
        </SelectField>
        <InputField label="Price" name="price" type="number" value={formData.price} onChange={onChange} />
        <InputField label="Thumbnail URL" name="thumbnail" value={formData.thumbnail} onChange={onChange} />
        <InputField label="Syllabus URL" name="syllabus" value={formData.syllabus} onChange={onChange} />
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Course
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

interface EditCourseModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  onChange: (e: React.ChangeEvent<any>) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ onClose, onSubmit, formData, onChange }) => {
  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Course</h2>
        <InputField label="Title" name="title" value={formData.title} onChange={onChange} />
        <TextAreaField label="Description" name="description" value={formData.description} onChange={onChange} />
        <SelectField label="Category" name="category" value={formData.category} onChange={onChange}>
          <option value="">-- Select Category --</option>
          <option value="web">Web Development</option>
          <option value="devops">DevOps</option>
          <option value="blockchain">Blockchain</option>
          <option value="web3">Web3</option>
        </SelectField>
        <InputField label="Price" name="price" type="number" value={formData.price} onChange={onChange} />
        <InputField label="Thumbnail URL" name="thumbnail" value={formData.thumbnail} onChange={onChange} />
        <InputField label="Syllabus URL" name="syllabus" value={formData.syllabus} onChange={onChange} />
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

interface DeleteCourseModalProps {
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({ onClose, onConfirm, courseTitle }) => {
  return (
    <ModalLayout onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Course</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <strong>{courseTitle}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

// Reusable Modal Layout Component
const ModalLayout: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// Helper Components
const InputField = ({ label, name, value, onChange, type = 'text' }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
    ></textarea>
  </div>
);

const SelectField = ({ label, name, value, onChange, children }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
    >
      {children}
    </select>
  </div>
);

export default CourseManager;