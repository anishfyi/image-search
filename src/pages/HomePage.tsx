import React from 'react';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/search/SearchBar';
import GoogleLogo from '../components/common/GoogleLogo';
import PersonalizedFeed from '../components/feed/PersonalizedFeed';

const HomePage: React.FC = () => {
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
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
      <div className="border-t border-neutral-border">
        <PersonalizedFeed />
      </div>
    </div>
  );
};

export default HomePage; 