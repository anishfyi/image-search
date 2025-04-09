import React from 'react';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/search/SearchBar';
import GoogleLogo from '../components/common/GoogleLogo';

const SearchPage: React.FC = () => {
  const { search, setQuery, searchByImage, isLoading, error } = useSearch();

  const handleSearch = (query: string) => {
    setQuery(query);
    search();
  };

  const handleImageSearch = async (file: File) => {
    try {
      await searchByImage(file);
    } catch (err) {
      console.error('Image search error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-[584px] mx-auto mb-8">
        <div className="flex justify-center mb-6">
          <GoogleLogo size="lg" />
        </div>
        <SearchBar
          onSearch={handleSearch}
          onImageSearch={handleImageSearch}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default SearchPage; 