import React from 'react';
import { ImageResult } from '../../types/image';

interface ResultsGridProps {
  results: ImageResult[];
  loading: boolean;
  error: string | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative aspect-video">
            <img
              src={result.thumbnailUrl}
              alt={result.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {result.metadata?.similarity && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {Math.round(result.metadata.similarity * 100)}% similar
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
              {result.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{result.source}</span>
              <span>{result.size}</span>
            </div>
            {result.metadata?.uploadedImage && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Uploaded image: {result.metadata.uploadedImage.width}x{result.metadata.uploadedImage.height}</p>
                <p>Size: {result.metadata.uploadedImage.size}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid; 