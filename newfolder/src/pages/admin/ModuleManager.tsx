import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil, Trash2, ChevronDown, Play, X, Send, FileText, CheckCircle } from 'lucide-react';

// Define Types
interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}
interface Module {
  id: string;
  title: string;
  videos: Video[];
}

const ModuleManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // State
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState<boolean>(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState<boolean>(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState<string>('');
  const [newVideoData, setNewVideoData] = useState({
    title: '',
    url: '',
    thumbnail: '',
  });



  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);


const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false);
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

  // Handle Add Module
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/module`,
        { title: newModuleTitle, courseId }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModules([...modules, res.data]);
      setNewModuleTitle('');
      setIsAddModuleModalOpen(false);
    } catch (err: any) {
      console.error('Error adding module:', err.response?.data?.message || err.message);
      alert('Failed to add module');
    }
  };

  //handle update modules
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
  } catch (err: any) {
    console.error('Error updating module:', err.response?.data || err.message);
    alert('Failed to update module');
  }
};
  // Handle Delete Module
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
  // Edit Video Modal
const EditVideoModal: React.FC<{
  video: Video;
  moduleId: string;
  onClose: () => void;
  onSubmit: (videoId: string, moduleId: string, data: { title: string; url: string; thumbnail?: string }) => void;
}> = ({ video, moduleId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: video.title,
    url: video.url,
    thumbnail: video.thumbnail || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    onSubmit(video.id, moduleId, formData);
    onClose();
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Video</h2>
        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <InputField label="URL" name="url" value={formData.url} onChange={handleChange} required />
        <InputField label="Thumbnail URL (optional)" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />

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
  //update video
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

  // Open Add Video Modal
  const openAddVideoModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsAddVideoModalOpen(true);
  };

  // Handle Add Video
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

  // Handle Delete Video
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
      {!loading && !error && modules.length > 0 && (
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleModuleExpand(module.id)}
                  className="flex items-center flex-1 text-left"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 mr-3 transition-transform duration-200 ${
                      expandedModule === module.id ? 'transform rotate-180' : ''
                    }`}
                  />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {module.title}
                  </h2>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                    ({module.videos.length} videos)
                  </span>
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAddVideoModal(module.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                 <button
  onClick={() => {
    
    setEditingModule(module);
    setIsEditModuleModalOpen(true);
  }}
>
  <Pencil className="h-5 w-5" />
</button>
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                </div>
              </div>

              {expandedModule === module.id && (
                <div className="p-6 space-y-4">
                  {module.videos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No videos in this module yet</p>
                      <button
                        onClick={() => openAddVideoModal(module.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Video
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {module.videos.map((video) => (
                        <div key={video.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <div className="relative">
                            <img
                              src={video.thumbnail || 'https://via.placeholder.com/400x225'} 
                              alt={video.title}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
                                onClick={() => navigate(`/admin/video/${video.id}`)}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Play
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                              {video.title}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
  <button
    onClick={() => navigate(`/admin/video/${video.id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
  >
    View Video
  </button>

  <div className="flex space-x-6">
    <button
          onClick={() => {
            console.log("hey");
            setEditingVideo(video);
            console.log("hey1");
            setIsEditVideoModalOpen(true);
            console.log("hey2");
          }}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
      <Pencil className="h-5 w-5" />
    </button>

    <button
      onClick={() => handleDeleteVideo(module.id, video.id)}
      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  </div>
</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Module Modal */}
      {isAddModuleModalOpen && (
        <AddModuleModal
          onClose={() => setIsAddModuleModalOpen(false)}
          onSubmit={(title) => {
            setNewModuleTitle(title);
            handleAddModule(new Event('submit') as unknown as React.FormEvent);
          }}
        />
      )}
       {/* Edit Module Modal */}
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
    

      {/* Add Video Modal */}
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
    {/* Edit Video Modal */}
{isEditVideoModalOpen && editingVideo && selectedModuleId && (
  <EditVideoModal
    video={editingVideo}
    moduleId={selectedModuleId}
    onClose={() => {
      setIsEditVideoModalOpen(false);
      setEditingVideo(null);
    }}
    onSubmit={(videoId, moduleId, data) => handleUpdateVideo(videoId, moduleId, data)}
  />
)}

    </div>
  );
};

export default ModuleManager;

// ------------------
// Subcomponents Below
// ------------------

//update module modal
const EditModuleModal: React.FC<{
  module: Module;
  onClose: () => void;
  onSubmit: (title: string) => void;
}> = ({ module, onClose, onSubmit }) => {
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



// Add Module Modal
const AddModuleModal: React.FC<{
  onClose: () => void;
  onSubmit: (title: string) => void;
}> = ({ onClose, onSubmit }) => {
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

// Add Video Modal
const AddVideoModal: React.FC<{
  moduleId: string;
  onClose: () => void;
  onSubmit: (moduleId: string, videoData: { title: string; url: string; thumbnail?: string }) => void;
}> = ({ moduleId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;
    onSubmit(moduleId, formData);
    setFormData({ title: '', url: '', thumbnail: '' });
    onClose();
  };

  return (
    <ModalLayout onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Video</h2>
        <InputField label="Video Title" name="title" value={formData.title} onChange={handleChange} required />
        <InputField label="Video URL" name="url" value={formData.url} onChange={handleChange} required />
        <InputField label="Thumbnail URL (optional)" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Video
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

// Reusable Modal Layout Component
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

// InputField Component
const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}> = ({ label, name, value, onChange, required = false, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
    />
  </div>
);

// // Play icon for video preview
// const Play = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="currentColor"
//     viewBox="0 0 20 20"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M6 4l15 8-15 8V4z" />
//   </svg>
// );