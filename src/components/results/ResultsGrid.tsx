import React, { useCallback, useRef, useState, KeyboardEvent } from 'react';
import { ImageResult } from '../../types/image';
import LazyImageViewer from './LazyImageViewer';
import ShareButton from './ShareButton';

interface ResultsGridProps {
  results: ImageResult[];
  loading: boolean;
  error: string | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, loading, error }) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
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
        setSelectedImage(results[index]);
        break;
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      itemRefs.current[newIndex]?.focus();
    }
  }, [focusedIndex, results]);

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
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8"
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
            className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
              focusedIndex === index ? 'ring-2 ring-[#1a73e8]' : ''
            }`}
            role="gridcell"
            aria-rowindex={Math.floor(index / 4) + 1}
            aria-colindex={(index % 4) + 1}
            tabIndex={focusedIndex === index ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => setSelectedImage(result)}
            onFocus={() => setFocusedIndex(index)}
          >
            <div 
              className="relative aspect-video group"
              role="img"
              aria-label={result.title}
            >
              <img
                src={result.thumbnailUrl}
                alt={result.title}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                loading="lazy"
              />
              {result.metadata?.similarity && (
                <div 
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full"
                  aria-label={`${Math.round(result.metadata.similarity * 100)}% similar`}
                >
                  {Math.round(result.metadata.similarity * 100)}% similar
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
            </div>
            <div className="p-3">
              <h3 
                className="text-sm font-normal text-[#202124] mb-1 line-clamp-2"
                id={`image-title-${result.id}`}
              >
                {result.title}
              </h3>
              <div 
                className="flex items-center justify-between text-xs text-[#70757a]"
                aria-label={`Image details: from ${result.source}, size ${result.size}`}
              >
                <span className="truncate">{result.source}</span>
                <span className="ml-2 whitespace-nowrap">{result.size}</span>
              </div>
              <div className="mt-2 flex justify-end">
                <ShareButton image={result} />
              </div>
              {result.metadata?.uploadedImage && (
                <div 
                  className="mt-2 text-xs text-[#70757a]"
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
      <LazyImageViewer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default ResultsGrid; 