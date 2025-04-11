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
    { text: 'nature photography', type: 'suggestion' as const },
    { text: 'nature wallpaper hd', type: 'suggestion' as const },
    { text: 'natural scenery', type: 'suggestion' as const },
    { text: 'nature background', type: 'suggestion' as const },
    { text: 'nature images free download', type: 'suggestion' as const },
    { text: 'beautiful nature', type: 'suggestion' as const },
    { text: 'landscape photography', type: 'suggestion' as const },
    { text: 'landscape wallpaper', type: 'suggestion' as const },
    { text: 'mountain scenery', type: 'suggestion' as const },
    { text: 'sunset images', type: 'suggestion' as const }
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
      const filtered = mockSuggestions
        .filter(suggestion =>
          suggestion.text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10); // Limit to 10 suggestions
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
          onFocus={() => {
            setIsFocused(true);
            setShowHistory(true);
          }}
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

      {(showSuggestions || showHistory) && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 bg-white rounded-[24px] shadow-[0_2px_6px_rgba(32,33,36,0.28)] border border-[#dfe1e5] overflow-hidden transition-all duration-200 ease-in-out transform origin-top">
          {showSuggestions && suggestions.length > 0 && (
            <SearchSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              selectedIndex={selectedSuggestionIndex}
            />
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