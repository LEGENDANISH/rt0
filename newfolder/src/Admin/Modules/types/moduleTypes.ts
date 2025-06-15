export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface Module {
  id: string;
  title: string;
  videos: Video[];
}

export interface ModulesListProps {
  modules: Module[];
  expandedModule: string | null;
  onToggleExpand: (moduleId: string) => void;
  onAddVideo: (moduleId: string) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (moduleId: string, videoId: string) => void;
}