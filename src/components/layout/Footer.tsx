import React from 'react';
import Navigation from './Navigation';
import { useTheme } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const footerNavItems = [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ];

  return (
    <footer className={`${theme === 'dark' ? 'bg-[#202124] text-white' : 'bg-neutral-hover text-neutral-text'} py-4 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Navigation 
            items={footerNavItems}
            itemClassName={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-neutral-secondary hover:text-neutral-text'}`}
          />
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-neutral-secondary'}`}>
            © {new Date().getFullYear()} | Made with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://github.com/anishfyi" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-primary-blue hover:underline'}`}
            >
              anishfyi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 