import React from 'react';
import { useSearch } from '../context/SearchContext';
import { ResultsGrid, Pagination } from '../components/results';

const ResultsPage: React.FC = () => {
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

export default ResultsPage; 