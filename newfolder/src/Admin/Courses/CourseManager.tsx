import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import CourseTable from './CoursesTable';
import CourseCards from './components/CourseCards';
import AddCourseModal from './modal/AddCourseModal';
import EditCourseModal from './modal/EditCourseModal';
import DeleteCourseModal from './modal/DeleteCourseModal';
import { Course } from './types';

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/courses';
  const token = localStorage.getItem('token');

  const fetchCourses = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      alert('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses().finally(() => setLoading(false));
  }, []);

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (course: Course) => {
    setCurrentCourse(course);
    setIsDeleteConfirmOpen(true);
  };

  const handleAddCourse = async (courseData: Omit<Course, 'id'>) => {
    try {
      const res = await axios.post(API_URL, courseData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses([...courses, res.data]);
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('Error adding course:', err.response?.data || err.message);
    }
  };

  const handleUpdateCourse = async (courseData: Omit<Course, 'id'>) => {
    if (!currentCourse) return;
    try {
      const res = await axios.put(`${API_URL}/${currentCourse.id}`, courseData, {
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
      setCourses(courses.filter((c) => c.id !== currentCourse.id));
      setIsDeleteConfirmOpen(false);
      setCurrentCourse(null);
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  if (loading) {
    return <p className="text-center py-4">Loading courses...</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Course
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <CourseTable 
          courses={courses} 
          expandedCourse={expandedCourse} 
          onToggleExpand={toggleCourseExpand}
          onEdit={openEditModal}
          onDelete={openDeleteConfirm}
        />
        
        <CourseCards 
          courses={courses} 
          expandedCourse={expandedCourse} 
          onToggleExpand={toggleCourseExpand}
          onEdit={openEditModal}
          onDelete={openDeleteConfirm}
        />
      </div>

      {isAddModalOpen && (
        <AddCourseModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCourse}
        />
      )}

      {isEditModalOpen && currentCourse && (
        <EditCourseModal
          course={currentCourse}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCourse}
        />
      )}

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

export default CourseManager;