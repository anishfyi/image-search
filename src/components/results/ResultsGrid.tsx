import React from 'react';
import { ImageResult } from '../../types/image';
import ImageResultCard from './ImageResultCard';

interface ResultsGridProps {
  results: ImageResult[];
  loading: boolean;
  error: string | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-red-500 text-center max-w-md">
          <p className="text-lg sm:text-xl font-semibold">Error loading results</p>
          <p className="text-xs sm:text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-gray-500 text-center max-w-md">
          <p className="text-lg sm:text-xl font-semibold">No results found</p>
          <p className="text-xs sm:text-sm mt-2">Try different search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4">
      {results.map((result) => (
        <ImageResultCard key={result.id} result={result} />
      ))}
    </div>
  );
};

export default ResultsGrid; 