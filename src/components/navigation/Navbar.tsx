import React from 'react';
import { Link } from 'react-router-dom';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SignInButton from '../auth/SignInButton';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className={`sticky top-0 z-50 ${
      theme === 'dark' 
        ? 'bg-[#202124] border-[#3c4043]' 
        : 'bg-white border-gray-200'
    } border-b`}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm hover:underline">About</Link>
          <Link to="/" className="text-sm hover:underline">Store</Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm hover:underline">Gmail</Link>
          <Link to="/images" className="text-sm hover:underline">Images</Link>
          <button 
            onClick={toggleTheme}
            className={`p-2 ${
              theme === 'dark' 
                ? 'hover:bg-[#3c4043] text-white' 
                : 'hover:bg-gray-100 text-gray-600'
            } rounded-full transition-colors`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
          <button className={`p-2 ${
            theme === 'dark' 
              ? 'hover:bg-[#3c4043] text-white' 
              : 'hover:bg-gray-100 text-gray-600'
            } rounded-full`}>
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-700'
              }`}>
                {user?.name}
              </span>
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 