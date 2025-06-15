import React from 'react';
import ModalLayout from './ModalLayout';

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

export default DeleteCourseModal;