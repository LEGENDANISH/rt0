import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { ModulesList } from './modules/ModulesList';
import { AddModuleModal } from './modal/AddModuleModal';
import { EditModuleModal } from './modal/EditModuleModal';
import { AddVideoModal } from './modal/AddVideoModal';
import { EditVideoModal } from './modal/EditVideoModal';
import { Module, Video } from './types/moduleTypes';

const ModuleManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // State declarations
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states with mutual exclusivity
  const [activeModal, setActiveModal] = useState<
  'addModule' | 'addVideo' | 'editModule' | 'editVideo' | null
>(null)
  
  // Selection states
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Load token and API URL
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch modules by course ID
  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_URL}/modules/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.modules || [];
      setModules(data);
    } catch (err: any) {
      console.error('Failed to fetch modules:', err.response?.data?.message || err.message);
      setError('Failed to load modules');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  // Toggle expand module
  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Module Operations
  const handleAddModule = async (title: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/module`,
        { title, courseId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules([...modules, res.data]);
      setActiveModal(null);
    } catch (err: any) {
      console.error('Error adding module:', err.response?.data?.message || err.message);
      alert('Failed to add module');
    }
  };

  const handleUpdateModule = async (moduleId: string, newTitle: string) => {
    try {
      const res = await axios.put(
        `${API_URL}/modules/${moduleId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(prev => prev.map(mod => (mod.id === moduleId ? res.data : mod)));
      setActiveModal(null);
      setEditingModule(null);
    } catch (err: any) {
      console.error('Error updating module:', err.response?.data || err.message);
      alert('Failed to update module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await axios.delete(`${API_URL}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(modules.filter(mod => mod.id !== moduleId));
    } catch (err: any) {
      console.error('Error deleting module:', err.message);
      alert('Failed to delete module');
    }
  };

  // Video Operations
  const handleAddVideo = async (moduleId: string, videoData: { title: string; url: string; thumbnail?: string }) => {
    try {
      const res = await axios.post(
        `${API_URL}/video`,
        { ...videoData, moduleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(prev =>
        prev.map(module =>
          module.id === moduleId
            ? { ...module, videos: [...module.videos, res.data] }
            : module
        )
      );
      setActiveModal(null);
    } catch (err: any) {
      console.error('Error adding video:', err.message);
      alert('Failed to add video');
    }
  };

  const handleUpdateVideo = async (videoId: string, moduleId: string, updatedData: { title?: string; url?: string; thumbnail?: string }) => {
    try {
      const res = await axios.put(
        `${API_URL}/video/${videoId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(prev =>
        prev.map(module =>
          module.id === moduleId
            ? { ...module, videos: module.videos.map(v => (v.id === videoId ? res.data : v)) }
            : module
        )
      );
      setActiveModal(null);
      setEditingVideo(null);
    } catch (err: any) {
      console.error('Error updating video:', err.response?.data || err.message);
      alert('Failed to update video');
    }
  };

  const handleDeleteVideo = async (moduleId: string, videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await axios.delete(`${API_URL}/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(prev =>
        prev.map(module =>
          module.id === moduleId
            ? { ...module, videos: module.videos.filter(v => v.id !== videoId) }
            : module
        )
      );
    } catch (err: any) {
      console.error('Error deleting video:', err.message);
      alert('Failed to delete video');
    }
  };

  // Modal handlers with proper state management
 const openAddModuleModal = (e?: React.MouseEvent) => {
  e?.stopPropagation();
  e?.preventDefault();
  setActiveModal('addModule');
  setEditingModule(null);
  setEditingVideo(null);
};
  const openAddVideoModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setActiveModal('addVideo');
    setEditingModule(null);
    setEditingVideo(null);
  };

  const openEditModuleModal = (module: Module) => {
    setEditingModule(module);
    setActiveModal('editModule');
    setEditingVideo(null);
  };

  const openEditVideoModal = (video: Video) => {
    setEditingVideo(video);
    const moduleWithVideo = modules.find(module => 
      module.videos.some(v => v.id === video.id)
    );
    setSelectedModuleId(moduleWithVideo?.id || null);
    setActiveModal('editVideo');
    setEditingModule(null);
  };

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedModuleId(null);
    setEditingModule(null);
    setEditingVideo(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Modules</h1>
        <button
          type="button"
          onClick={openAddModuleModal}
          className="flex items-center justify-center w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Add Module</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-4 sm:py-6">
          <p className="text-gray-600 dark:text-gray-400">Loading modules...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4 sm:py-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <ModulesList
            modules={modules}
            expandedModule={expandedModule}
            onToggleExpand={toggleModuleExpand}
            onAddVideo={openAddVideoModal}
            onEditModule={openEditModuleModal}
            onDeleteModule={handleDeleteModule}
            onEditVideo={openEditVideoModal}
            onDeleteVideo={handleDeleteVideo}
          />
        </div>
      )}

      <AddModuleModal
        isOpen={activeModal === 'addModule'}
        onClose={closeAllModals}
        onSubmit={handleAddModule}
      />

      <EditModuleModal
  isOpen={activeModal === 'editModule'}
  module={editingModule} // Must be a Module object or null
  onClose={closeAllModals}
  onSubmit={(newTitle) => {
    if (editingModule) {
      handleUpdateModule(editingModule.id, newTitle);
    }
  }}
/>

      <AddVideoModal
        isOpen={activeModal === 'addVideo'}
        moduleId={selectedModuleId}
        onClose={closeAllModals}
        onSubmit={(moduleId, data) => moduleId && handleAddVideo(moduleId, data)}
      />

      <EditVideoModal
        isOpen={activeModal === 'editVideo'}
        video={editingVideo}
        moduleId={selectedModuleId}
        onClose={closeAllModals}
        onSubmit={(videoId, moduleId, data) => moduleId && handleUpdateVideo(videoId, moduleId, data)}
      />
    </div>
  );
};

export default ModuleManager;