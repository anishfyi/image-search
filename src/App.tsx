import React from 'react';
import SearchBar from './components/search/SearchBar';
import { SearchProvider } from './context/SearchContext';
import MainLayout from './components/layout/MainLayout';

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
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
          <h1 className="text-4xl font-bold mb-8">Google Image Search</h1>
          <SearchBar
            onSearch={handleSearch}
            onImageSearch={handleImageSearch}
          />
        </div>
      </MainLayout>
    </SearchProvider>
  );
};

export default App;
