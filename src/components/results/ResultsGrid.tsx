import React, { useCallback, useRef, useState, KeyboardEvent } from 'react';
import { ImageResult } from '../../types/image';

interface ResultsGridProps {
  results: ImageResult[];
  loading: boolean;
  error: string | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, loading, error }) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const gridCols = {
      sm: 2,
      md: 3,
      lg: 4
    };

    // Determine current grid columns based on viewport width
    let currentCols = gridCols.lg;
    if (window.innerWidth < 768) {
      currentCols = gridCols.sm;
    } else if (window.innerWidth < 1024) {
      currentCols = gridCols.md;
    }

    let newIndex = focusedIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(index + 1, results.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(index - 1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(index + currentCols, results.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(index - currentCols, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = results.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        // Open image in modal or full view
        openImage(results[index]);
        break;
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      itemRefs.current[newIndex]?.focus();
    }
  }, [focusedIndex, results]);

  const openImage = (image: ImageResult) => {
    // TODO: Implement modal or full view
    console.log('Opening image:', image);
  };

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        role="status"
        aria-label="Loading search results"
      >
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="text-center text-red-500 py-8"
        role="alert"
        aria-live="polite"
      >
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div 
        className="text-center text-gray-500 py-8"
        role="status"
        aria-live="polite"
      >
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      role="grid"
      aria-label="Search results grid"
      aria-rowcount={Math.ceil(results.length / 4)}
      aria-colcount={4}
    >
      {results.map((result, index) => (
        <div
          ref={(el: HTMLDivElement | null) => {
            itemRefs.current[index] = el;
          }}
          key={result.id}
          className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
            focusedIndex === index ? 'ring-2 ring-blue-500' : ''
          }`}
          role="gridcell"
          aria-rowindex={Math.floor(index / 4) + 1}
          aria-colindex={(index % 4) + 1}
          tabIndex={focusedIndex === index ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onClick={() => openImage(result)}
          onFocus={() => setFocusedIndex(index)}
        >
          <div 
            className="relative aspect-video"
            role="img"
            aria-label={result.title}
          >
            <img
              src={result.thumbnailUrl}
              alt={result.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {result.metadata?.similarity && (
              <div 
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
                aria-label={`${Math.round(result.metadata.similarity * 100)}% similar`}
              >
                {Math.round(result.metadata.similarity * 100)}% similar
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 
              className="text-sm font-medium text-gray-900 mb-1 line-clamp-2"
              id={`image-title-${result.id}`}
            >
              {result.title}
            </h3>
            <div 
              className="flex items-center justify-between text-xs text-gray-500"
              aria-label={`Image details: from ${result.source}, size ${result.size}`}
            >
              <span>{result.source}</span>
              <span>{result.size}</span>
            </div>
            {result.metadata?.uploadedImage && (
              <div 
                className="mt-2 text-xs text-gray-500"
                aria-label={`Original image: ${result.metadata.uploadedImage.width}x${result.metadata.uploadedImage.height} pixels, size ${result.metadata.uploadedImage.size}`}
              >
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