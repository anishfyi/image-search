import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import ImageSearch from './ImageSearch';

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
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ text: string; type: 'history' | 'suggestion' }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleVoiceResult = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const handleVoiceError = (error: string) => {
    console.error('Voice search error:', error);
    // You could show a toast notification here
  };

  const handleImageError = (error: string) => {
    console.error('Image search error:', error);
    // You could show a toast notification here
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center w-full">
          <div className="absolute left-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-secondary" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            className="w-full h-12 pl-12 pr-12 text-base text-neutral-text bg-white rounded-full border border-neutral-border hover:shadow-hover focus:shadow-hover focus:outline-none transition-all duration-200"
            placeholder="Search images..."
          />
          <div className="absolute right-2 flex items-center space-x-1">
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
        <div className="flex justify-center mt-6 space-x-4">
          <Button type="submit" variant="secondary">
            Google Search
          </Button>
          <Button type="button" variant="secondary">
            I'm Feeling Lucky
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 