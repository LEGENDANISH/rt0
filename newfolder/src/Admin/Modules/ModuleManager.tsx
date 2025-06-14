import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';

// Import from other files
import { Video, AddVideoModal, EditVideoModal } from '../Video/VideoSystem';
import { 
  Module, 
  ModulesList, 
  AddModuleModal, 
  EditModuleModal 
} from './ModuleSystem';

const ModuleManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // State
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState<boolean>(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState<boolean>(false);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState<boolean>(false);
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState<boolean>(false);
  
  // Selection states
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Load token and API URL
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api';

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModules([...modules, res.data]);
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModules((prev) =>
        prev.map((mod) => (mod.id === moduleId ? res.data : mod))
      );
      setIsEditModuleModalOpen(false);
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

      setModules(modules.filter((mod) => mod.id !== moduleId));
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId
            ? { ...module, videos: [...module.videos, res.data] }
            : module
        )
      );
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI
      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                videos: module.videos.map((v) => (v.id === videoId ? res.data : v)),
              }
            : module
        )
      );

      setIsEditVideoModalOpen(false);
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

      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId
            ? { ...module, videos: module.videos.filter((v) => v.id !== videoId) }
            : module
        )
      );
    } catch (err: any) {
      console.error('Error deleting video:', err.message);
      alert('Failed to delete video');
    }
  };

  // Modal handlers
  const openAddVideoModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsAddVideoModalOpen(true);
  };

  const openEditModuleModal = (module: Module) => {
    setEditingModule(module);
    setIsEditModuleModalOpen(true);
  };

  const openEditVideoModal = (video: Video) => {
    setEditingVideo(video);
    // Find the module that contains this video
    const moduleWithVideo = modules.find(module => 
      module.videos.some(v => v.id === video.id)
    );
    if (moduleWithVideo) {
      setSelectedModuleId(moduleWithVideo.id);
    }
    setIsEditVideoModalOpen(true);
  };

  // JSX
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modules</h1>
        <button
          onClick={() => setIsAddModuleModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Module
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center py-4">Loading modules...</p>}

      {/* Error */}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}

      {/* Modules List */}
      {!loading && !error && (
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
      )}

      {/* Modals */}
      {isAddModuleModalOpen && (
        <AddModuleModal
          onClose={() => setIsAddModuleModalOpen(false)}
          onSubmit={handleAddModule}
        />
      )}

      {isEditModuleModalOpen && editingModule && (
        <EditModuleModal
          module={editingModule}
          onClose={() => {
            setIsEditModuleModalOpen(false);
            setEditingModule(null);
          }}
          onSubmit={(newTitle) => handleUpdateModule(editingModule.id, newTitle)}
        />
      )}

      {isAddVideoModalOpen && selectedModuleId && (
        <AddVideoModal
          moduleId={selectedModuleId}
          onClose={() => {
            setIsAddVideoModalOpen(false);
            setSelectedModuleId(null);
          }}
          onSubmit={(moduleId, data) => handleAddVideo(moduleId, data)}
        />
      )}

      {isEditVideoModalOpen && editingVideo && selectedModuleId && (
        <EditVideoModal
          video={editingVideo}
          moduleId={selectedModuleId}
          onClose={() => {
            setIsEditVideoModalOpen(false);
            setEditingVideo(null);
            setSelectedModuleId(null);
          }}
          onSubmit={(videoId, moduleId, data) => handleUpdateVideo(videoId, moduleId, data)}
        />
      )}
    </div>
  );
};

export default ModuleManager;