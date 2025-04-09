import React from 'react';
import GoogleLogo from '../common/GoogleLogo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {children}
      </main>

      <footer className="bg-neutral-hover py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-neutral-secondary hover:text-neutral-text">
                About
              </a>
              <a href="#" className="text-sm text-neutral-secondary hover:text-neutral-text">
                Privacy
              </a>
              <a href="#" className="text-sm text-neutral-secondary hover:text-neutral-text">
                Terms
              </a>
            </div>
            <div className="text-sm text-neutral-secondary">
              © {new Date().getFullYear()} Google Clone
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 