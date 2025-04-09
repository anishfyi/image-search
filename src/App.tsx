import React from 'react';
import SearchBar from './components/search/SearchBar';
import { SearchProvider } from './context/SearchContext';
import MainLayout from './components/layout/MainLayout';
import GoogleLogo from './components/common/GoogleLogo';

const App: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleImageSearch = (file: File) => {
    console.log('Image search with file:', file.name);
  };

  return (
    <SearchProvider>
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="w-full max-w-[584px] mx-auto mb-8">
            <div className="flex justify-center mb-6">
              <GoogleLogo size="lg" />
            </div>
            <SearchBar
              onSearch={handleSearch}
              onImageSearch={handleImageSearch}
            />
          </div>
        </div>
      </MainLayout>
    </SearchProvider>
  );
};

export default App;
