import React, { useCallback, useRef, useState, KeyboardEvent, useEffect } from 'react';
import { ImageResult } from '../../types/image';
import { useTheme } from '../../context/ThemeContext';
import LazyImageViewer from './LazyImageViewer';

interface ResultsGridProps {
  results: ImageResult[];
  loading: boolean;
  error: string | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, loading, error }) => {
  const { theme } = useTheme();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const gridCols = {
      xs: 2,  // Added extra small size for mobile phones
      sm: 2,
      md: 3,
      lg: 4,
      xl: 6
    };

    // Determine current grid columns based on viewport width
    let currentCols = gridCols.lg;
    if (window.innerWidth < 480) {
      currentCols = gridCols.xs;
    } else if (window.innerWidth < 640) {
      currentCols = gridCols.sm;
    } else if (window.innerWidth < 768) {
      currentCols = gridCols.md;
    } else if (window.innerWidth < 1280) {
      currentCols = gridCols.lg;
    } else {
      currentCols = gridCols.xl;
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className={`aspect-[4/3] rounded-lg ${
              theme === 'dark' ? 'bg-[#303134]' : 'bg-gray-200'
            }`} />
            <div className="mt-2 space-y-2">
              <div className={`h-4 rounded ${
                theme === 'dark' ? 'bg-[#303134]' : 'bg-gray-200'
              }`} />
              <div className={`h-3 rounded w-2/3 ${
                theme === 'dark' ? 'bg-[#303134]' : 'bg-gray-200'
              }`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4">
        <div className={`text-4xl mb-4 ${
          theme === 'dark' ? 'text-[#969ba1]' : 'text-gray-400'
        }`}>
          ⚠️
        </div>
        <div className={`text-lg font-medium mb-2 ${
          theme === 'dark' ? 'text-[#e8eaed]' : 'text-gray-800'
        }`}>
          Something went wrong
        </div>
        <div className={`text-center ${
          theme === 'dark' ? 'text-[#969ba1]' : 'text-gray-600'
        }`}>
          {error}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4">
        <div className={`text-4xl mb-4 ${
          theme === 'dark' ? 'text-[#969ba1]' : 'text-gray-400'
        }`}>
          🔍
        </div>
        <div className={`text-lg font-medium mb-2 ${
          theme === 'dark' ? 'text-[#e8eaed]' : 'text-gray-800'
        }`}>
          No results found
        </div>
        <div className={`text-center ${
          theme === 'dark' ? 'text-[#969ba1]' : 'text-gray-600'
        }`}>
          Try different keywords or check your spelling
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4"
        role="grid"
        aria-label="Search results grid"
      >
        {results.map((result, index) => (
          <div
            ref={(el: HTMLDivElement | null) => {
              itemRefs.current[index] = el;
            }}
            key={result.id}
            className={`relative group ${
              focusedIndex === index 
                ? theme === 'dark'
                  ? 'ring-2 ring-[#8ab4f8]'
                  : 'ring-2 ring-[#1a73e8]'
                : ''
            }`}
            role="gridcell"
            tabIndex={focusedIndex === index ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onClick={() => setSelectedImage(result)}
          >
            <div className={`aspect-square rounded-md overflow-hidden ${
              theme === 'dark' ? 'bg-[#303134]' : 'bg-gray-100'
            }`}>
              <img
                src={result.thumbnailUrl}
                alt={result.title}
                className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className={`mt-1 ${isMobile ? 'px-0.5' : 'mt-2'}`}>
              <div className={`line-clamp-1 ${
                isMobile ? 'text-xs' : 'text-sm'
              } ${
                theme === 'dark'
                  ? 'text-[#bdc1c6] group-hover:text-[#8ab4f8]'
                  : 'text-gray-900 group-hover:text-[#1a73e8]'
              }`}>
                {result.title}
              </div>
              <div className={`${
                isMobile ? 'text-[10px]' : 'text-xs'
              } ${
                theme === 'dark' ? 'text-[#969ba1]' : 'text-gray-600'
              }`}>
                {result.source}
              </div>
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