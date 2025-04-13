import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Squares2X2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SignInButton from '../auth/SignInButton';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`sticky top-0 z-50 ${
      theme === 'dark' 
        ? 'bg-[#202124] border-[#3c4043]' 
        : 'bg-white border-gray-200'
    } ${isMobile ? '' : 'border-b'}`}>
      <div className={`flex items-center justify-between ${isMobile ? 'px-2 py-2' : 'px-4 py-2'}`}>
        {/* Left Section */}
        {isMobile ? (
          <div className="flex items-center">
            <Link to="/" className="mr-2">
              <img 
                src={theme === 'dark' ? '/google-logo-white.png' : '/google-logo.png'} 
                alt="Google" 
                className="h-6"
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm hover:underline">About</Link>
            <Link to="/" className="text-sm hover:underline">Store</Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {!isMobile && (
            <>
              <Link to="/" className="text-sm hover:underline">Gmail</Link>
              <Link to="/images" className="text-sm hover:underline">Images</Link>
            </>
          )}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className={`p-2 ${
                theme === 'dark' 
                  ? 'hover:bg-[#3c4043] text-white' 
                  : 'hover:bg-gray-100 text-gray-600'
              } rounded-full transition-colors`}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          )}
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
          {!isMobile && (
            <button className={`p-2 ${
              theme === 'dark' 
                ? 'hover:bg-[#3c4043] text-white' 
                : 'hover:bg-gray-100 text-gray-600'
              } rounded-full`}>
              <Squares2X2Icon className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center">
            <SignInButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className={`px-4 py-2 ${
          theme === 'dark' 
            ? 'bg-[#202124] border-t border-[#3c4043]' 
            : 'bg-white border-t border-gray-200'
        }`}>
          <div className="flex flex-col space-y-4 py-2">
            <Link to="/" className="text-sm hover:underline">About</Link>
            <Link to="/" className="text-sm hover:underline">Store</Link>
            <Link to="/" className="text-sm hover:underline">Gmail</Link>
            <Link to="/images" className="text-sm hover:underline">Images</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 