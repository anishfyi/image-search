import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, CameraIcon } from '../common/icons';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import SearchHistory from './SearchHistory';
import { useSearch } from '../../context/SearchContext';
import ImageSearch from './ImageSearch';
import GoogleLens from './GoogleLens';
import AudioListeningAnimation from '../common/AudioListeningAnimation';
import { XMarkIcon } from '../common/icons';

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
  const [showLens, setShowLens] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { query = '', setQuery, searchHistory, clearHistory } = useSearch();
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
        setIsFocused(false);
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
      setShowSuggestions(false);
      setShowHistory(false);
      setSelectedSuggestionIndex(-1);
      inputRef.current?.blur();
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
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex !== -1) {
        onSearch(suggestions[selectedSuggestionIndex].text);
        setShowSuggestions(false);
        setShowHistory(false);
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
    if (query.trim()) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowSuggestions(false);
      setShowHistory(true);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[584px] mx-auto"
    >
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center w-full bg-white rounded-[24px] border ${
          isFocused 
            ? 'border-transparent shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]' 
            : 'border-[#dfe1e5] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:border-[#dfe1e5]'
        } transition-all duration-200 focus-within:outline-none`}
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
          onFocus={() => {
            setIsFocused(true);
            setShowHistory(true);
          }}
          className="flex-1 h-[46px] bg-transparent text-[16px] leading-[22px] tracking-[0.1px] text-[#202124] outline-none placeholder-[#9aa0a6] px-0 border-none focus:ring-0 focus:outline-none appearance-none"
          placeholder="Search images"
          autoComplete="off"
          aria-label="Search images"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-[9px] mx-[6px] hover:bg-[#f8f9fa] rounded-full transition-colors"
            aria-label="Clear search input"
          >
            <XMarkIcon className="w-[20px] h-[20px] text-[#70757a]" />
          </button>
        )}

        <div className="flex items-center gap-2 pr-[8px] pl-[7px] min-w-[88px]">
          <button
            type="button"
            onClick={() => setShowVoiceSearch(true)}
            className="p-[9px] hover:bg-[#f8f9fa] rounded-full transition-colors group"
            aria-label="Search by voice"
          >
            <MicrophoneIcon className="w-6 h-6 text-[#4285f4] group-hover:text-[#1a73e8]" />
          </button>

          <div className="h-[24px] mx-[3px] border-l border-[#dfe1e5]" />

          <ImageSearch 
            onImageSelect={onImageSearch} 
            onError={(err) => error ? null : handleImageError(err)} 
          />
        </div>
      </form>

      {/* Suggestions/History Dropdown */}
      {(showSuggestions || showHistory) && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-[24px] shadow-[0_2px_6px_rgba(32,33,36,0.28)] border border-[#dfe1e5] overflow-hidden">
          {showHistory && searchHistory.length > 0 && !query && (
            <SearchHistory
              onSelect={(text) => {
                setQuery(text);
                onSearch(text);
                setShowHistory(false);
              }}
              onClear={() => {
                clearHistory();
                setShowHistory(false);
              }}
            />
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <SearchSuggestions
              suggestions={suggestions}
              selectedIndex={selectedSuggestionIndex}
              onSelect={(text) => {
                setQuery(text);
                onSearch(text);
                setShowSuggestions(false);
              }}
            />
          )}
        </div>
      )}

      {showVoiceSearch && (
        <VoiceSearch
          onClose={() => setShowVoiceSearch(false)}
          onResult={(text) => {
            setQuery(text);
            setShowVoiceSearch(false);
            onSearch(text);
          }}
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