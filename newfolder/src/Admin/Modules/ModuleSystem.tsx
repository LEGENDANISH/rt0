import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, X } from 'lucide-react';
import { Video, VideoGrid } from '../Video/VideoSystem';
import { ModuleCard } from './../../components/ModuleCard';
import { InputField } from './../../components/Inputfeild';
// Define Types
export interface Module {
  id: string;
  title: string;
  videos: Video[];
}



// Modules List Component
interface ModulesListProps {
  modules: Module[];
  expandedModule: string | null;
  onToggleExpand: (moduleId: string) => void;
  onAddVideo: (moduleId: string) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (moduleId: string, videoId: string) => void;
}

export const ModulesList: React.FC<ModulesListProps> = ({
  modules,
  expandedModule,
  onToggleExpand,
  onAddVideo,
  onEditModule,
  onDeleteModule,
  onEditVideo,
  onDeleteVideo
}) => {
  if (modules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No modules found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          isExpanded={expandedModule === module.id}
          onToggleExpand={onToggleExpand}
          onAddVideo={onAddVideo}
          onEditModule={onEditModule}
          onDeleteModule={onDeleteModule}
          onEditVideo={onEditVideo}
          onDeleteVideo={onDeleteVideo}
        />
      ))}
    </div>
  );
};

// Add Module Modal
interface AddModuleModalProps {
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export const AddModuleModal: React.FC<AddModuleModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
    onClose();
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Module</h2>
        
        <InputField label="Module Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Module
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

// Edit Module Modal
interface EditModuleModalProps {
  module: Module;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export const EditModuleModal: React.FC<EditModuleModalProps> = ({ module, onClose, onSubmit }) => {
  const [title, setTitle] = useState(module.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title === module.title) {
      onClose();
      return;
    }

    onSubmit(title);
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Module</h2>
        <InputField label="Module Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Update
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

// Shared Components
const ModalLayout: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
