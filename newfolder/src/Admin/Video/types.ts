export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface VideoCardProps {
  video: Video;
  moduleId: string;
  onEdit: (video: Video) => void;
  onDelete: (moduleId: string, videoId: string) => void;
}

export interface VideoGridProps {
  videos: Video[];
  moduleId: string;
  onAddVideo: (moduleId: string) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (moduleId: string, videoId: string) => void;
}

export interface AddVideoModalProps {
  moduleId: string;
  onClose: () => void;
  onSubmit: (moduleId: string, videoData: { title: string; url: string; thumbnail?: string }) => void;
}

export interface EditVideoModalProps {
  video: Video;
  moduleId: string;
  onClose: () => void;
  onSubmit: (videoId: string, moduleId: string, data: { title: string; url: string; thumbnail?: string }) => void;
}

export interface ModalLayoutProps {
  onClose: () => void;
  children: React.ReactNode;
}

export interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}
