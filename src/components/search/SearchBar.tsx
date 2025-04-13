import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, CameraIcon } from '../common/icons';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import SearchHistory from './SearchHistory';
import TrendingSuggestions from './TrendingSuggestions';
import { useSearch } from '../../context/SearchContext';
import ImageSearch from './ImageSearch';
import { XMarkIcon } from '../common/icons';
import { getTrendingSearches } from '../../services/trendingService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onImageSearch: (file: File) => void;
  initialQuery?: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  theme?: 'dark' | 'light';
  showWavyUnderline?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onImageSearch,
  initialQuery = '',
  isLoading = false,
  error = null,
  className = '',
  theme = 'light',
  showWavyUnderline = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ text: string; type: 'history' | 'suggestion' }>>([]);
  const [trendingSuggestions, setTrendingSuggestions] = useState<Array<{
    id: number;
    text: string;
    category: string;
    trending: boolean;
  }>>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showLens, setShowLens] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { query = '', setQuery, searchHistory, clearHistory } = useSearch();
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Mock suggestions - in a real app, these would come from an API
  const mockSuggestions = [
    { text: 'summer dresses', type: 'suggestion' as const },
    { text: 'evening gowns', type: 'suggestion' as const },
    { text: 'wedding dresses', type: 'suggestion' as const },
    { text: 'casual dresses', type: 'suggestion' as const },
    { text: 'formal dresses', type: 'suggestion' as const },
    { text: 'party dresses', type: 'suggestion' as const },
    { text: 'maxi dresses', type: 'suggestion' as const },
    { text: 'cocktail dresses', type: 'suggestion' as const },
    { text: 'prom dresses', type: 'suggestion' as const },
    { text: 'designer dresses', type: 'suggestion' as const }
  ];

  // Update query from initialQuery only once on component mount or when initialQuery changes
  const initialQueryRef = useRef(initialQuery);
  
  useEffect(() => {
    if (initialQueryRef.current !== initialQuery) {
      initialQueryRef.current = initialQuery;
      if (initialQuery !== undefined) {
        setQuery(initialQuery);
      }
    }
  }, [initialQuery]);

  // Load trending suggestions
  useEffect(() => {
    const loadTrending = async () => {
      const trending = await getTrendingSearches();
      console.log('Loaded trending suggestions:', trending);
      setTrendingSuggestions(trending);
    };
    loadTrending();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
        setShowTrending(false);
        setSelectedSuggestionIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle query changes
  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSuggestions
        .filter(suggestion =>
          suggestion.text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(isFocused);
      setShowHistory(false);
      setShowTrending(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(false);
      setShowTrending(isFocused);
    }
    setSelectedSuggestionIndex(-1);
  }, [query, isFocused]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Don't automatically show trending on initial focus
      setIsFocused(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (query.trim()) {
      onSearch(query.trim());
      navigate('/images');
      setShowSuggestions(false);
      setShowHistory(false);
      setShowTrending(false);
      setSelectedSuggestionIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    navigate('/images');
    setShowSuggestions(false);
    setShowHistory(false);
    setShowTrending(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex !== -1) {
        onSearch(suggestions[selectedSuggestionIndex].text);
        setShowSuggestions(false);
        setShowHistory(false);
        setShowTrending(false);
      } else if (query.trim()) {
        handleSubmit(e as any);
      }
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const newIndex = selectedSuggestionIndex + direction;
      if (newIndex >= -1 && newIndex < suggestions.length) {
        setSelectedSuggestionIndex(newIndex);
        if (newIndex !== -1) {
          setQuery(suggestions[newIndex].text);
        }
      }
    }
  };

  const handleVoiceResult = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleVoiceError = (error: string) => {
    console.error('Voice search error:', error);
  };

  const handleImageError = (error: string) => {
    console.error('Image search error:', error);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (!query.trim()) {
      setShowSuggestions(false);
      setShowHistory(false);
      setShowTrending(true);
    } else {
      setShowTrending(false);
      setShowSuggestions(true);
    }
  };

  const handleCameraClick = () => {
    if (isMobile) {
      // Open Google Lens or device camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setIsCameraOpen(true);
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            // Handle camera stream
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              video.play();
              // Here you can implement Google Lens-like functionality
              // For now, we'll just take a photo
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext('2d')?.drawImage(video, 0, 0);
              const imageData = canvas.toDataURL('image/jpeg');
              // Convert to File object
              fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                  onImageSearch(file);
                  stream.getTracks().forEach(track => track.stop());
                  setIsCameraOpen(false);
                });
            };
          })
          .catch(err => {
            console.error('Camera error:', err);
            setIsCameraOpen(false);
          });
      }
    } else {
      // Handle desktop image upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          onImageSearch(file);
        }
      };
      input.click();
    }
  };

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full mx-auto ${
        isMobile ? 'max-w-full px-0' : 'max-w-[584px] px-4'
      } ${className}`}
    >
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center w-full ${
          isMobile 
            ? 'rounded-full h-12' 
            : 'rounded-[24px] h-[46px]'
        } ${
          theme === 'dark' ? 'bg-[#303134]' : isMobile ? 'bg-[rgba(32,33,36,0.04)]' : 'bg-white'
        } border ${
          isFocused 
            ? theme === 'dark'
              ? 'border-[#8ab4f8] shadow-none'
              : 'border-transparent shadow-[0_1px_6px_rgba(32,33,36,0.28)]' 
            : theme === 'dark'
              ? 'border-[#5f6368] hover:border-[#8ab4f8]'
              : 'border-[#dfe1e5] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]'
        } transition-all duration-200`}
      >
        <div className={`flex items-center ${isMobile ? 'pl-4' : 'pl-[14px]'} pr-[13px]`}>
          <MagnifyingGlassIcon className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} ${theme === 'dark' ? 'text-[#9aa0a6]' : 'text-[#9aa0a6]'}`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className={`flex-1 ${
            isMobile 
              ? 'text-[16px] h-10' 
              : 'text-[16px] h-[46px]'
          } leading-[22px] tracking-[0.1px] bg-transparent ${
            theme === 'dark' 
              ? 'text-white placeholder-gray-400' 
              : 'text-[#202124] placeholder-[#9aa0a6]'
          } outline-none px-0 border-none focus:ring-0 focus:outline-none appearance-none min-w-0`}
          placeholder={isMobile ? "Search" : "Search images"}
          autoComplete="off"
          aria-label="Search images"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className={`${
              isMobile ? 'p-2 mx-0' : 'p-[6px] mx-[2px]'
            } ${theme === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-[#f8f9fa]'} rounded-full transition-colors flex-shrink-0`}
            aria-label="Clear search input"
          >
            <XMarkIcon className={`${isMobile ? 'w-5 h-5' : 'w-[18px] h-[18px]'} ${theme === 'dark' ? 'text-[#9aa0a6]' : 'text-[#70757a]'}`} />
          </button>
        )}

        <div className={`flex items-center gap-1 ${isMobile ? 'pr-4' : 'pr-[6px]'} pl-[4px] flex-shrink-0`}>
          <button
            type="button"
            onClick={() => setShowVoiceSearch(true)}
            className={`${
              isMobile ? 'p-2' : 'p-[6px]'
            } ${theme === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-[#f8f9fa]'} rounded-full transition-colors group flex-shrink-0`}
            aria-label="Search by voice"
          >
            <MicrophoneIcon className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-[#4285f4] group-hover:text-[#1a73e8]`} />
          </button>

          <div className={`h-[20px] mx-[2px] border-l ${theme === 'dark' ? 'border-[#5f6368]' : 'border-[#dfe1e5]'} ${isMobile ? 'hidden' : 'block'}`} />

          <button
            type="button"
            onClick={handleCameraClick}
            className={`${
              isMobile ? 'p-2' : 'p-[6px]'
            } ${theme === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-[#f8f9fa]'} rounded-full transition-colors group flex-shrink-0`}
            aria-label="Search by image"
          >
            <CameraIcon className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-[#4285f4] group-hover:text-[#1a73e8]`} />
          </button>
        </div>
      </form>

      {showWavyUnderline && isMobile && theme === 'dark' && (
        <div className="w-full px-16 -mt-1">
          <svg className="w-full h-3" viewBox="0 0 100 4" preserveAspectRatio="none">
            <path 
              d="M0,3.5 C5,0.5 10,6.5 15,3.5 C20,0.5 25,6.5 30,3.5 C35,0.5 40,6.5 45,3.5 C50,0.5 55,6.5 60,3.5 C65,0.5 70,6.5 75,3.5 C80,0.5 85,6.5 90,3.5 C95,0.5 100,6.5 105,3.5" 
              stroke="red" 
              strokeWidth="1.5" 
              fill="none"
            />
          </svg>
        </div>
      )}

      {(showSuggestions || showHistory || showTrending) && trendingSuggestions.length > 0 && (
        <div className={`absolute left-0 right-0 top-[100%] z-50 mt-1 ${
          isMobile 
            ? 'mx-2 rounded-xl' 
            : 'rounded-2xl'
        } shadow-md ${
          theme === 'dark'
            ? 'bg-[#202124] border border-[#3c4043]'
            : 'bg-white border border-gray-200'
        }`}>
          {showTrending && (
            <TrendingSuggestions
              suggestions={trendingSuggestions}
              onSelect={handleSuggestionSelect}
              theme={theme}
            />
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-[#202124] border border-[#3c4043]' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.text}
                    className={`w-full px-4 py-2 text-left ${
                      index === selectedSuggestionIndex 
                        ? theme === 'dark'
                          ? 'bg-[#3c4043] text-[#e8eaed]'
                          : 'bg-gray-100 text-gray-900'
                        : theme === 'dark'
                          ? 'text-[#e8eaed] hover:bg-[#3c4043]'
                          : 'text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSuggestionSelect(suggestion.text)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showHistory && searchHistory.length > 0 && (
            <SearchHistory
              onSelect={handleSuggestionSelect}
              onClear={clearHistory}
            />
          )}
        </div>
      )}

      {showVoiceSearch && (
        <VoiceSearch
          onClose={() => setShowVoiceSearch(false)}
          onResult={handleVoiceResult}
        />
      )}

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className={`bg-white rounded-lg ${
            isMobile ? 'w-full h-full' : 'max-w-[90vw] max-h-[90vh] p-4'
          }`}>
            <div className={`flex items-center justify-between ${isMobile ? 'p-4' : ''}`}>
              <h3 className="text-lg font-medium">Camera Access</h3>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className={`${isMobile ? 'p-4' : ''}`}>
              <p className="mb-4">Please allow camera access to use this feature.</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsCameraOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={`absolute top-full left-0 right-0 mt-3 ${
          isMobile ? 'mx-4' : ''
        } px-4 py-2 bg-[#fce8e6] text-[#d93025] rounded-lg text-[13px] leading-5`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 