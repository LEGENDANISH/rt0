import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Trash2, FileText, ChevronDown, Menu, X, CheckCircle } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  avatar: string;
}

const VideoPlayer: React.FC = () => {
  const { courseId, videoId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'John Doe',
      content: 'Great explanation of React hooks! Really helped me understand useEffect better.',
      timestamp: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      user: 'Jane Smith',
      content: 'Could you explain more about the dependency array in useEffect?',
      timestamp: '1 hour ago',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'Current User',
      content: newComment,
      timestamp: 'Just now',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

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

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-40 overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Content</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 dark:text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {/* Module list */}
            <div className="space-y-2">
              <div className="font-medium text-gray-900 dark:text-white">Module 1: Getting Started</div>
              <div className="ml-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>1.1 Introduction</span>
                </div>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                  <div className="w-4 h-4 mr-2 rounded-full bg-blue-600" />
                  <span>1.2 Setup Guide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video and details section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Video Player */}
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden mb-6">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              ></iframe>
            </div>

            <div className="space-y-4">
              {/* Mark as complete button */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark as Complete
              </button>

              {/* Description Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Description</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showDescription ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {showDescription && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      Learn about React hooks and how they can help you write more maintainable React components.
                      This video covers useState, useEffect, and custom hooks with practical examples.
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Attachments</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showAttachments ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {showAttachments && (
                  <div className="px-6 pb-4 space-y-4">
                    <a
                      href="#"
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Lecture Notes
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF - 1.2 MB</p>
                      </div>
                    </a>

                    <a
                      href="#"
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Code Examples
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ZIP - 5.8 MB</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-4">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Current user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Comment
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {comment.user}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {comment.timestamp}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;