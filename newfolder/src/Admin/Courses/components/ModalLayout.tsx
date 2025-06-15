import React from 'react';
import { X } from 'lucide-react';

interface ModalLayoutProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;