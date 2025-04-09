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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading results</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold">No results found</p>
          <p className="text-sm mt-2">Try different search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {results.map((result) => (
        <ImageResultCard key={result.id} result={result} />
      ))}
    </div>
  );
};

export default ResultsGrid; 