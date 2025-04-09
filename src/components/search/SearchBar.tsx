import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import ImageSearch from './ImageSearch';
import SearchHistory from './SearchHistory';
import { useSearch } from '../../context/SearchContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onImageSearch?: (file: File) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onImageSearch,
  initialQuery = '' 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ text: string; type: 'history' | 'suggestion' }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, searchHistory } = useSearch();

  // Mock suggestions - in a real app, these would come from an API
  const mockSuggestions = [
    { text: 'nature', type: 'suggestion' as const },
    { text: 'landscape', type: 'suggestion' as const },
    { text: 'mountains', type: 'history' as const },
    { text: 'ocean', type: 'history' as const },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(true);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const handleVoiceResult = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const handleVoiceError = (error: string) => {
    console.error('Voice search error:', error);
  };

  const handleImageError = (error: string) => {
    console.error('Image search error:', error);
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowSuggestions(false);
      setShowHistory(true);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="relative w-full">
          <div className="group flex items-center w-full bg-white rounded-full border hover:shadow-google focus-within:shadow-google hover:border-transparent focus-within:border-transparent transition-all duration-200">
            <div className="absolute left-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full h-12 pl-12 pr-24 text-base text-neutral-900 bg-transparent rounded-full focus:outline-none"
              placeholder="Search images..."
            />
            <div className="absolute right-2 flex items-center space-x-2">
              <VoiceSearch
                onResult={handleVoiceResult}
                onError={handleVoiceError}
              />
              <ImageSearch
                onImageSelect={onImageSearch || (() => {})}
                onError={handleImageError}
              />
            </div>
          </div>
          {showSuggestions && (
            <SearchSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
            />
          )}
          {showHistory && searchHistory.length > 0 && (
            <SearchHistory
              onSelect={handleSuggestionSelect}
              className="absolute top-full left-0 right-0 mt-1 z-10"
            />
          )}
        </div>
        <div className="flex justify-center mt-8 space-x-3">
          <button
            type="submit"
            className="px-6 py-2 text-sm bg-[#f8f9fa] text-[#3c4043] rounded hover:shadow-sm hover:border-[#dadce0] border border-transparent"
          >
            Google Search
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm bg-[#f8f9fa] text-[#3c4043] rounded hover:shadow-sm hover:border-[#dadce0] border border-transparent"
          >
            I'm Feeling Lucky
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 