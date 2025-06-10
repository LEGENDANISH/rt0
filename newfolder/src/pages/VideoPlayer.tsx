import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Trash2, FileText, ChevronDown, Menu, X, CheckCircle, List } from 'lucide-react';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  moduleId: number;
}

interface Module {
  id: number;
  title: string;
  courseId: number;
  videos: Video[];
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
}

const VideoPlayer: React.FC = () => {
  const { courseId, videoId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showCourseContent, setShowCourseContent] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Truncate title function
  const truncateTitle = (title: string, maxLength: number = 8) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  // Fetch comments
  const fetchComments = async () => {
    if (!videoId) return;
    
    try {
      setCommentsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data)
      setComments(response.data);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch modules data
        const response = await axios.get(`http://localhost:5000/api/modules/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const modulesData = response.data;
        setModules(modulesData);

        // Find current video from modules
        let foundVideo: Video | null = null;
        for (const module of modulesData) {
          const video = module.videos.find((v: Video) => v.id === parseInt(videoId!));
          if (video) {
            foundVideo = video;
            break;
          }
        }

        if (foundVideo) {
          setCurrentVideo(foundVideo);
        } else {
          setError('Video not found');
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong while loading data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && videoId) {
      fetchData();
      fetchComments();
    }
  }, [courseId, videoId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || commentSubmitting) return;

    try {
      setCommentSubmitting(true);
      const response = await axios.post('http://localhost:5000/api/comment', {
        comment: newComment,
        videoId: parseInt(videoId!)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // Refresh comments after successful post
      await fetchComments();
      setNewComment('');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      // You might want to show an error message to the user
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Remove comment from local state
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      console.error('Error deleting comment:', err);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Video not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-20 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video and details section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Video Player */}
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden mb-6">
              <iframe
                src={getYouTubeEmbedUrl(currentVideo.url)}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={currentVideo.title}
              ></iframe>
            </div>

            {/* Video Title */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {currentVideo.title}
            </h1>

            <div className="space-y-4">
              {/* Course Content Dropdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowCourseContent(!showCourseContent)}
                  className="w-full px-4 md:px-6 py-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center">
                    <List className="w-5 h-5 mr-2 text-gray-500" />
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Course Content</h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showCourseContent ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {showCourseContent && (
                  <div className="px-4 md:px-6 pb-4 max-h-60 overflow-y-auto">
                    <div className="space-y-3">
                      {modules.map((module) => (
                        <div key={module.id} className="space-y-2">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {module.title}
                          </div>
                          <div className="ml-4 space-y-1">
                            {module.videos.map((video) => (
                              <div 
                                key={video.id}
                                className={`flex items-center text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded ${
                                  video.id === parseInt(videoId!) 
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium' 
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={() => {
                                  window.location.href = `/my-courses/${courseId}/video/${video.id}`;
                                }}
                              >
                                {video.id === parseInt(videoId!) ? (
                                  <div className="w-3 h-3 mr-2 rounded-full bg-blue-600" />
                                ) : (
                                  <CheckCircle className="w-3 h-3 mr-2 text-gray-400" />
                                )}
                                <span className="truncate">{video.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full px-4 md:px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Description</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showDescription ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {showDescription && (
                  <div className="px-4 md:px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                      Watch this video to learn more about the topic. This is part of the course module.
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="w-full px-4 md:px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Attachments</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showAttachments ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {showAttachments && (
                  <div className="px-4 md:px-6 pb-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No attachments available for this video.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    rows={3}
                    disabled={commentSubmitting}
                  ></textarea>
                  <button
                    type="submit"
                    disabled={commentSubmitting || !newComment.trim()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {commentSubmitting ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 md:space-y-6 max-h-96 overflow-y-auto">
              {commentsLoading ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">
                            {comment.user.name}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm md:text-base break-words">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;