import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { ModuleUpdaterProps } from '../types/moduleTypes';

export const ModuleUpdater: React.FC<ModuleUpdaterProps> = ({ currentName, handleUpdateModule }) => {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(currentName);

  const handleUpdate = () => {
    handleUpdateModule(newName);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <Pencil className="h-5 w-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Update Module Name</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Enter new module name"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};