import React from 'react';
import { useSearch } from '../context/SearchContext';
import { ResultsGrid, Pagination } from '../components/results';

const ResultsPage: React.FC = () => {
  const { searchResults: results, isLoading, error, currentPage, totalPages, setCurrentPage } = useSearch();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <ResultsGrid results={[]} loading={true} error={null} />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <ResultsGrid results={[]} loading={false} error={error} />
      </div>
    );
  }

  // Handle no results state
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <ResultsGrid results={results} loading={false} error={null} />
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

export default ResultsPage; 