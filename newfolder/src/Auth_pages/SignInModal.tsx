// src/components/auth/SignInModal.tsx
import React, { useState, useEffect } from 'react';
import { X, User, Mail } from 'lucide-react';
import axios from 'axios';
import AuthCard from '../components/AuthCard'; // Adjusted import path to resolve the compilation error

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  onLoginSuccess?: (user: any) => void;
}

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe?: boolean;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
  onLoginSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Reset state when modal opens
      setError(null);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignIn = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // NOTE: For a real application, replace 'http://localhost:5000/api/signIn' with your actual backend API endpoint.
      const response = await axios.post('http://localhost:5000/api/signIn', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { token, user } = response.data;
      console.log("Sign In successful:", response.data);

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Call success callback (optional)
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      // Close modal
      onClose();

      // Optionally reload page or redirect user
      // For a React app, consider using a routing library (e.g., react-router-dom) for navigation
      // instead of window.location.reload() for a smoother user experience.
      // window.location.reload();
    } catch (err: any) {
      console.error("Sign-in error:", err);
      const message =
        err.response?.data?.message ||
        'An error occurred during sign in. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    onClose(); // Close sign-in modal
    onOpenSignUp(); // Open sign-up modal
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose} // Allows clicking outside the modal to close it
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        {/* Modal Header with Title and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {/* Using a User icon for consistency with the sign-in theme */}
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome Back</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            disabled={loading}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth Card - now solely responsible for form content */}
        <AuthCard
          mode="signin"
          onSubmit={handleSignIn}
          onSwitchMode={handleSwitchToSignUp}
          // onClose prop is no longer passed to AuthCard, as the modal itself handles the close button
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default SignInModal;
