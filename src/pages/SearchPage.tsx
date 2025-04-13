import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/search/SearchBar';
import Navbar from '../components/navigation/Navbar';
import { useNavigate } from 'react-router-dom';

const GoogleLogo = ({ theme, isMobile }: { theme: 'light' | 'dark', isMobile: boolean }) => (
  <svg viewBox="0 0 272 92" width={isMobile ? "160" : "272"} height={isMobile ? "53" : "92"}>
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

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { searchByText, searchByImage } = useSearch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async (query: string) => {
    await searchByText(query);
    navigate('/images');
  };

  const handleImageSearch = async (file: File) => {
    try {
      await searchByImage(file);
      navigate('/images');
    } catch (err) {
      console.error('Image search error:', err);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#202124] text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />

      {/* Main Content */}
      <main className={`flex flex-col items-center justify-between ${isMobile ? 'min-h-[calc(100vh-56px)]' : ''} px-0`}>
        {/* Top section with logo and search bar */}
        <div className={`flex flex-col items-center w-full ${isMobile ? 'mt-6 mb-8' : 'mt-32'}`}>
          <div className={`${isMobile ? 'mb-5' : 'mb-8'}`}>
            <GoogleLogo theme={theme} isMobile={isMobile} />
          </div>

          <div className="w-full">
            <SearchBar
              onSearch={handleSearch}
              onImageSearch={handleImageSearch}
            />
          </div>

          <div className={`${isMobile ? 'mt-6 flex justify-center w-full space-x-2' : 'mt-8 flex flex-row space-x-4'}`}>
            <button 
              onClick={() => handleSearch('Google Search')}
              className={`px-4 py-2 text-sm ${
                isMobile ? 'text-xs px-3 py-[9px]' : ''
              } ${
                theme === 'dark' 
                  ? 'bg-[#303134] hover:bg-[#3c4043] text-white'
                  : 'bg-[#f8f9fa] hover:bg-gray-200 text-gray-800 border border-[#f8f9fa] hover:border-gray-200'
              } rounded`}>
              Google Search
            </button>
            <button 
              onClick={() => handleSearch("I'm Feeling Lucky")}
              className={`px-4 py-2 text-sm ${
                isMobile ? 'text-xs px-3 py-[9px]' : ''
              } ${
                theme === 'dark' 
                  ? 'bg-[#303134] hover:bg-[#3c4043] text-white'
                  : 'bg-[#f8f9fa] hover:bg-gray-200 text-gray-800 border border-[#f8f9fa] hover:border-gray-200'
              } rounded`}>
              I'm Feeling Lucky
            </button>
          </div>
        </div>

        {/* Bottom section with language options */}
        {isMobile && <div className="flex-grow" />}
        
        <div className={`${isMobile ? 'w-full py-4 border-t border-gray-200 dark:border-[#3c4043]' : 'mt-8'} text-sm text-center`}>
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Google offered in: 
          </span>
          <div className={`${isMobile ? 'flex flex-wrap justify-center gap-2 mt-2' : 'inline-flex space-x-2 ml-2'}`}>
            <a href="#" className="text-[#8ab4f8] hover:underline">हिन्दी</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">বাংলা</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">తెలుగు</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">मराठी</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">தமிழ்</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">ગુજરાતી</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">ಕನ್ನಡ</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">മലയാളം</a>
            <a href="#" className="text-[#8ab4f8] hover:underline">ਪੰਜਾਬੀ</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage; 