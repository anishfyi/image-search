import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-google-gray">
      <header className="flex items-center justify-between px-4 py-2">
        <div className="text-2xl font-google-sans text-google-text">Google</div>
        <button className="google-button">Sign in</button>
      </header>
      
      <main className="flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Google or type a URL"
              className="flex-1 bg-transparent border-none outline-none px-2"
            />
            <button className="google-icon-button">
              <svg className="w-5 h-5 text-google-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V22h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
            <button className="google-icon-button">
              <svg className="w-5 h-5 text-google-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 