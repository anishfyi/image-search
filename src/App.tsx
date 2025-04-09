import React from 'react';
import SearchBar from './components/search/SearchBar';
import { SearchProvider, useSearch } from './context/SearchContext';
import MainLayout from './components/layout/MainLayout';
import GoogleLogo from './components/common/GoogleLogo';
import { ResultsGrid, Pagination } from './components/results';

const SearchResults: React.FC = () => {
  const { results, isLoading, error, currentPage, totalPages, setCurrentPage } = useSearch();

  if (results.length === 0 && !isLoading && !error) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <ResultsGrid results={results} loading={isLoading} error={error} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

const SearchContent: React.FC = () => {
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
      <SearchResults />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SearchProvider>
      <MainLayout>
        <SearchContent />
      </MainLayout>
    </SearchProvider>
  );
};

export default App;
