import React from 'react';

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer; 