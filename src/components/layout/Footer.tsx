import React from 'react';
import Navigation from './Navigation';

const Footer: React.FC = () => {
  const footerNavItems = [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ];

  return (
    <footer className="bg-neutral-hover py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Navigation 
            items={footerNavItems}
            itemClassName="text-sm text-neutral-secondary hover:text-neutral-text"
          />
          <div className="text-sm text-neutral-secondary">
            © {new Date().getFullYear()} Google Clone
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 