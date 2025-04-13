import React, { useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import ResultsGrid from '../components/results/ResultsGrid';
import SearchBar from '../components/search/SearchBar';
import { Link } from 'react-router-dom';
import { BeakerIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/navigation/Navbar';

const GoogleLogo = ({ theme }: { theme: 'light' | 'dark' }) => (
  <svg viewBox="0 0 272 92" width="92" height="30">
    <path
      fill={theme === 'dark' ? '#ffffff' : '#4285F4'}
      d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
    />
    <path
      fill={theme === 'dark' ? '#ffffff' : '#EA4335'}
      d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
    />
    <path
      fill={theme === 'dark' ? '#ffffff' : '#FBBC05'}
      d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
    />
    <path
      fill={theme === 'dark' ? '#ffffff' : '#4285F4'}
      d="M225 3v65h-9.5V3h9.5z"
    />
    <path
      fill={theme === 'dark' ? '#ffffff' : '#34A853'}
      d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
    />
    <path
      fill={theme === 'dark' ? '#ffffff' : '#EA4335'}
      d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
    />
  </svg>
);

const ResultImagesPage: React.FC = () => {
  const { searchResults: results, isLoading, error, query, searchByText, searchByImage } = useSearch();
  const { theme } = useTheme();

  useEffect(() => {
    // Initial search when component mounts if there's a query
    if (query) {
      const performSearch = async () => {
        try {
          await searchByText(query);
        } catch (error) {
          console.error('Search error:', error);
        }
      };
      performSearch();
    }
  }, []); // Only run on mount

  const handleSearch = async (newQuery: string) => {
    try {
      await searchByText(newQuery);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleImageSearch = async (file: File) => {
    try {
      await searchByImage(file);
    } catch (err) {
      console.error('Image search error:', err);
    }
  };

  const navigationItems = [
    { name: 'All', href: '#', current: false },
    { name: 'Images', href: '#', current: true },
    { name: 'Videos', href: '#', current: false },
    { name: 'Shopping', href: '#', current: false },
    { name: 'Maps', href: '#', current: false },
    { name: 'News', href: '#', current: false },
    { name: 'Books', href: '#', current: false },
  ];

  const suggestionChips = [
    'h&m tote bag price',
    'h&m canvas tote',
    'h&m shopper bag',
    'h&m bag collection',
    'h&m tote bag black',
    'h&m tote bag review',
    'h&m bag sale',
    'h&m accessories'
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#202124] text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />

      {/* Search Section */}
      <div className="flex items-center px-[156px] py-4">
        <Link to="/" className="mr-8">
          <GoogleLogo theme={theme} />
        </Link>
        <SearchBar
          onSearch={handleSearch}
          onImageSearch={handleImageSearch}
          initialQuery={query}
          className="!max-w-[692px] !mx-0"
        />
      </div>

      {/* Navigation and Tools */}
      <div className="flex items-center justify-between px-[156px] py-1 border-b border-gray-200 dark:border-[#3c4043]">
        <div className="flex items-center space-x-6">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-sm py-2 ${
                item.current
                  ? theme === 'dark'
                    ? 'text-[#8ab4f8] border-b-2 border-[#8ab4f8]'
                    : 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
                  : theme === 'dark'
                    ? 'text-[#969ba1] hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.name}
            </a>
          ))}
          <button className={`text-sm ${
            theme === 'dark'
              ? 'text-[#969ba1] hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            More
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className={`text-sm ${
            theme === 'dark'
              ? 'text-[#969ba1] hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Tools
          </button>
          <button className={`flex items-center gap-1 text-sm ${
            theme === 'dark'
              ? 'text-[#969ba1] hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            <BookmarkIcon className="w-4 h-4" />
            Saved
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 px-[156px] py-3 overflow-x-auto scrollbar-hide">
        {suggestionChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSearch(chip)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${
              theme === 'dark'
                ? 'bg-black text-[#e8eaed] hover:bg-[#3c4043] border border-[#5f6368]'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="px-[156px] py-4">
        {/* Results Count */}
        <div className={`text-sm ${
          theme === 'dark' ? 'text-[#969ba1]' : 'text-gray-600'
        } mb-4`}>
          About {results?.length || 0} results
        </div>

        {/* Results Grid */}
        <ResultsGrid results={results || []} loading={isLoading} error={error} />
      </main>
    </div>
  );
};

export default ResultImagesPage; 