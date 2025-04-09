import React from 'react';
import GoogleLogo from '../common/GoogleLogo';
import Navigation from './Navigation';

const Header: React.FC = () => {
  const mainNavItems = [
    { label: 'Images', href: '#' },
    { label: 'Maps', href: '#' },
    { label: 'News', href: '#' },
  ];

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-border">
      <div className="flex items-center space-x-4">
        <GoogleLogo size="sm" />
        <div className="hidden md:block">
          <Navigation items={mainNavItems} />
        </div>
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