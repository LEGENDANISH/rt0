
import { Video, VideoGrid } from '../pages/admin/ModuleManagment/VideoSystem';
import { Plus, Pencil, Trash2, ChevronDown, X } from 'lucide-react';



interface ModuleCardProps {
  module: Module;
  isExpanded: boolean;
  onToggleExpand: (moduleId: string) => void;
  onAddVideo: (moduleId: string) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (moduleId: string, videoId: string) => void;
}
export interface Module {
  id: string;
  title: string;
  videos: Video[];
}
export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isExpanded,
  onToggleExpand,
  onAddVideo,
  onEditModule,
  onDeleteModule,
  onEditVideo,
  onDeleteVideo
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onToggleExpand(module.id)}
          className="flex items-center flex-1 text-left"
        >
          <ChevronDown
            className={`w-5 h-5 text-gray-500 mr-3 transition-transform duration-200 ${
              isExpanded ? 'transform rotate-180' : ''
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
            onClick={() => onAddVideo(module.id)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEditModule(module)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDeleteModule(module.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-4">
          <VideoGrid
            videos={module.videos}
            moduleId={module.id}
            onAddVideo={onAddVideo}
            onEditVideo={onEditVideo}
            onDeleteVideo={onDeleteVideo}
          />
        </div>
      )}
    </div>
  );
};
