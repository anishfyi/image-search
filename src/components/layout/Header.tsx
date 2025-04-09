import React from 'react';
import GoogleLogo from '../common/GoogleLogo';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-border">
      <div className="flex items-center space-x-4">
        <GoogleLogo size="sm" />
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-sm text-neutral-text hover:text-primary-blue">
            Images
          </a>
          <a href="#" className="text-sm text-neutral-text hover:text-primary-blue">
            Maps
          </a>
          <a href="#" className="text-sm text-neutral-text hover:text-primary-blue">
            News
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-sm text-neutral-text hover:text-primary-blue">
          Sign in
        </button>
      </div>
    </header>
  );
};

export default Header; 