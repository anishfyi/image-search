import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, CameraIcon } from '../common/icons';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import SearchHistory from './SearchHistory';
import TrendingSuggestions from './TrendingSuggestions';
import { useSearch } from '../../context/SearchContext';
import ImageSearch from './ImageSearch';
import GoogleLens from './GoogleLens';
import AudioListeningAnimation from '../common/AudioListeningAnimation';
import { XMarkIcon } from '../common/icons';
import { getTrendingSearches } from '../../services/trendingService';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onImageSearch: (file: File) => void;
  initialQuery?: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  theme?: 'dark' | 'light';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onImageSearch,
  initialQuery = '',
  isLoading = false,
  error = null,
  className = '',
  theme = 'light'
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
      setShowSuggestions(true);
      setShowHistory(false);
      setShowTrending(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(false);
      setShowTrending(true);
    }
    setSelectedSuggestionIndex(-1);
  }, [query]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
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

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-[584px] mx-auto ${className}`}
    >
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center w-full bg-white rounded-[24px] border ${
          isFocused 
            ? 'border-transparent shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]' 
            : 'border-[#dfe1e5] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:border-[#dfe1e5]'
        } transition-all duration-200 focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)]`}
      >
        <div className="flex items-center pl-[14px] pr-[13px]">
          <MagnifyingGlassIcon className="w-5 h-5 text-[#9aa0a6]" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="flex-1 h-[46px] bg-transparent text-[16px] leading-[22px] tracking-[0.1px] text-[#202124] outline-none placeholder-[#9aa0a6] px-0 border-none focus:ring-0 focus:outline-none appearance-none min-w-0"
          placeholder="Search images"
          autoComplete="off"
          aria-label="Search images"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-[6px] mx-[2px] hover:bg-[#f8f9fa] rounded-full transition-colors flex-shrink-0"
            aria-label="Clear search input"
          >
            <XMarkIcon className="w-[18px] h-[18px] text-[#70757a]" />
          </button>
        )}

        <div className="flex items-center gap-1 pr-[6px] pl-[4px] flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowVoiceSearch(true)}
            className="p-[6px] hover:bg-[#f8f9fa] rounded-full transition-colors group flex-shrink-0"
            aria-label="Search by voice"
          >
            <MicrophoneIcon className="w-5 h-5 text-[#4285f4] group-hover:text-[#1a73e8]" />
          </button>

          <div className="h-[20px] mx-[2px] border-l border-[#dfe1e5]" />

          <ImageSearch 
            onImageSelect={onImageSearch} 
            onError={(err) => error ? null : handleImageError(err)} 
          />
        </div>
      </form>

      {(showSuggestions || showHistory || showTrending) && trendingSuggestions.length > 0 && (
        <div className={`absolute left-0 right-0 top-[100%] z-50 mt-1 rounded-2xl shadow-md ${
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

      {error && (
        <div className="absolute top-full left-0 right-0 mt-3 px-4 py-2 bg-[#fce8e6] text-[#d93025] rounded-lg text-[13px] leading-5">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 