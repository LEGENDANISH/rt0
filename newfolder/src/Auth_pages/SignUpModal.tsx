// src/components/auth/SignUpModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install: npm install axios
import AuthCard from '../components/AuthCard'; // Adjusted import path to potentially resolve component

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
  onSignUpSuccess?: (user: any) => void; // Add this callback
}

// FormData interface defined previously in AuthCard.tsx, re-defining for clarity in this context.
// In a larger project, consider a shared types file.
interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe?: boolean; // Not used in signup, but kept for AuthCard compatibility
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onOpenSignIn,
  onSignUpSuccess // Add this prop
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Reset error state when modal opens
      setError(null);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // If modal is not open, render nothing
  if (!isOpen) return null;

  const handleSignUp = async (formData: FormData) => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // NOTE: For a real application, replace 'http://localhost:5000/api/signUp' with your actual backend API endpoint.
      // Axios is used here as per the original code.
      const response = await axios.post('http://localhost:5000/api/signUp', {
        name: formData.name, // Pass name for signup
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      console.log("Sign Up successful:", response.data);

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Call success callback (optional)
      if (onSignUpSuccess) {
        onSignUpSuccess(user);
      }

      // Close modal on successful sign up
      onClose();

      // Optionally reload page or redirect user.
      // For a React app, consider using a routing library (e.g., react-router-dom) for navigation
      // instead of window.location.reload() for a smoother user experience.
      // window.location.reload(); // Uncomment if a page reload is desired after signup
    } catch (err: any) {
      console.error("Sign-up error:", err);
      // Extract error message from response, or provide a generic one
      const errorMessage =
        err.response?.data?.message ||
        'An error occurred during sign up. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignIn = () => {
    onClose(); // Close sign-up modal
    onOpenSignIn(); // Open sign-in modal
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose} // Allows clicking outside the modal to close it
    >
      <div
        className="relative w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        {/*
          AuthCard component is used here for consistent UI and logic.
          It handles the form fields, validation, and layout for both sign-in and sign-up.
        */}
        <AuthCard
          mode="signup" // Set mode to 'signup'
          onSubmit={handleSignUp} // Pass the sign-up submission handler
          onSwitchMode={handleSwitchToSignIn} // Pass the handler to switch to sign-in
          onClose={onClose} // Pass the close modal handler
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default SignUpModal;