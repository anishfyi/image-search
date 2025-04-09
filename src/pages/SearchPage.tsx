import React from 'react';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/search/SearchBar';
import GoogleLogo from '../components/common/GoogleLogo';

const SearchPage: React.FC = () => {
  const { searchByText, setQuery, searchByImage, isLoading, error } = useSearch();

  const handleSearch = async (query: string) => {
    setQuery(query);
    await searchByText(query);
  };

  const handleImageSearch = async (file: File) => {
    try {
      await searchByImage(file);
    } catch (err) {
      console.error('Image search error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="w-full max-w-[584px] -mt-[10vh] md:-mt-[15vh]">
        <div className="flex justify-center mb-8">
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