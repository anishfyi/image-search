import React, { useState, useRef } from 'react';
import Button from '../common/Button';
import { MagnifyingGlassIcon, MicrophoneIcon, CameraIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleVoiceSearch = () => {
    // TODO: Implement voice search functionality
    console.log('Voice search clicked');
  };

  const handleImageSearch = () => {
    // TODO: Implement image search functionality
    console.log('Image search clicked');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center w-full">
        <div className="absolute left-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-neutral-secondary" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-12 text-base text-neutral-text bg-white rounded-full border border-neutral-border hover:shadow-hover focus:shadow-hover focus:outline-none transition-all duration-200"
          placeholder="Search images..."
        />
        <div className="absolute right-2 flex items-center space-x-1">
          <Button
            variant="icon"
            size="sm"
            onClick={handleVoiceSearch}
            aria-label="Voice search"
          >
            <MicrophoneIcon className="w-5 h-5 text-neutral-secondary" />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={handleImageSearch}
            aria-label="Search by image"
          >
            <CameraIcon className="w-5 h-5 text-neutral-secondary" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <Button type="submit" variant="secondary">
          Google Search
        </Button>
        <Button type="button" variant="secondary">
          I'm Feeling Lucky
        </Button>
      </div>
    </form>
  );
};

export default SearchBar; 