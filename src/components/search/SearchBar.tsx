import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MagnifyingGlassIcon } from '../common/icons';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import SearchHistory from './SearchHistory';
import { useSearch } from '../../context/SearchContext';
import ImageUpload from './ImageUpload';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onImageSearch: (file: File) => void;
  initialQuery?: string;
  isLoading?: boolean;
  error?: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onImageSearch,
  initialQuery = '',
  isLoading = false,
  error = null
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ text: string; type: 'history' | 'suggestion' }>>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, searchHistory } = useSearch();
  const [showImageUpload, setShowImageUpload] = useState(false);

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
        setSelectedSuggestionIndex(-1);
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
    setSelectedSuggestionIndex(-1);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      setShowHistory(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setShowHistory(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && !showHistory) return;

    const suggestions = showSuggestions ? mockSuggestions : searchHistory.map(h => ({ text: h.query, type: 'history' as const }));
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex].text);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setShowHistory(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
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

  const handleImageSelect = (file: File) => {
    onImageSearch(file);
    setShowImageUpload(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      role="search"
      aria-label="Image search"
    >
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col items-center"
        role="search"
        aria-label="Search images"
      >
        <div className="relative w-full">
          <div className="group flex items-center w-full bg-white rounded-full border hover:shadow-google focus-within:shadow-google hover:border-transparent focus-within:border-transparent transition-all duration-200">
            <div className="absolute left-4" aria-hidden="true">
              <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              className="w-full h-12 pl-12 pr-24 text-base text-neutral-900 bg-transparent rounded-full focus:outline-none"
              placeholder="Search images..."
              disabled={isLoading}
              aria-label="Search images"
              aria-describedby={error ? 'search-error' : undefined}
              aria-expanded={showSuggestions || showHistory}
              aria-controls={showSuggestions || showHistory ? 'search-suggestions' : undefined}
              aria-activedescendant={selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined}
              role="combobox"
              aria-autocomplete="list"
            />
            <div className="flex items-center space-x-2 pr-4">
              <VoiceSearch
                onResult={handleVoiceResult}
                onError={handleVoiceError}
              />
              <button
                type="button"
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label={showImageUpload ? "Close image upload" : "Upload image to search"}
                aria-expanded={showImageUpload}
                aria-controls="image-upload-section"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {(showSuggestions || showHistory) && (
            <div
              ref={suggestionsRef}
              id="search-suggestions"
              className="absolute top-full left-0 right-0 mt-1 z-10"
              role="listbox"
              aria-label="Search suggestions"
            >
              {showSuggestions && (
                <SearchSuggestions
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  selectedIndex={selectedSuggestionIndex}
                />
              )}
              {showHistory && searchHistory.length > 0 && (
                <SearchHistory
                  onSelect={handleSuggestionSelect}
                  className="absolute top-full left-0 right-0 mt-1 z-10"
                  selectedIndex={selectedSuggestionIndex}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-2 text-sm bg-[#f8f9fa] text-[#3c4043] rounded hover:shadow-sm hover:border-[#dadce0] border border-transparent disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={isLoading ? "Searching..." : "Search"}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm bg-[#f8f9fa] text-[#3c4043] rounded hover:shadow-sm hover:border-[#dadce0] border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="I'm Feeling Lucky"
          >
            I'm Feeling Lucky
          </button>
        </div>
      </form>

      {error && (
        <div 
          id="search-error"
          className="mt-2 text-red-500 text-sm text-center"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {showImageUpload && (
        <div 
          id="image-upload-section"
          className="mt-4"
          role="region"
          aria-label="Image upload"
        >
          <ImageUpload onImageSelect={handleImageSelect} />
        </div>
      )}
    </div>
  );
};

export default SearchBar; 