// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import SignInModal from '../Auth/SignInModal';
import SignUpModal from '../Auth/SignUpModal';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { theme, toggleTheme } = useTheme();

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // You might want to validate the token with your backend here
      // and get user info if the token is valid
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    console.log('User logged out');
  };

  const handleLoginSuccess = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleSignUpSuccess = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    console.log('User signed up:', userData);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Left section with menu button */}
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={onMenuClick}
                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Center section with search */}
            <div className="flex-1 flex items-center justify-center px-2 lg:px-6">
              <div className="max-w-lg w-full">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Type here to search.."
                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Right section with theme toggle and auth buttons */}
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="text-gray-500 dark:text-gray-400" size={20} />
                ) : (
                  <Moon className="text-gray-500" size={20} />
                )}
              </button>
              
              {/* Desktop auth buttons */}
              <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    {user?.name && (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Welcome, {user.name}
                      </span>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full font-medium transition-colors duration-200"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSignUpOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium transition-colors duration-200"
                    >
                      Signup
                    </button>
                    <button
                      onClick={() => setIsSignInOpen(true)}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 py-2 px-6 rounded-full font-medium transition-colors duration-200"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>

              {/* Mobile auth buttons */}
              <div className="md:hidden flex items-center gap-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSignUpOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      Signup
                    </button>
                    <button
                      onClick={() => setIsSignInOpen(true)}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 py-1 px-3 rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onOpenSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onOpenSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
        onSignUpSuccess={handleSignUpSuccess}
      />
    </>
  );
};

export default Navbar;