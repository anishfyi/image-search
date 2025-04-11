import React from 'react';
import { MagnifyingGlassIcon, ClockIcon } from '../common/icons';

interface SearchSuggestion {
  text: string;
  type: 'history' | 'suggestion';
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: string) => void;
  className?: string;
  selectedIndex: number;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  className = '',
  selectedIndex
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div 
      className={`absolute top-full left-0 w-full bg-white z-50 ${className}`}
      role="listbox"
      aria-label="Search suggestions"
    >
      <ul className="py-[6px] w-full">
        {suggestions.map((suggestion, index) => (
          <li 
            key={index}
            role="option"
            aria-selected={index === selectedIndex}
          >
            <button
              onClick={() => onSelect(suggestion.text)}
              className={`w-full px-4 py-[10px] text-left hover:bg-[#f8f9fa] flex items-center gap-3 group transition-colors ${
                index === selectedIndex ? 'bg-[#f8f9fa]' : ''
              }`}
              id={`suggestion-${index}`}
            >
              {suggestion.type === 'history' ? (
                <ClockIcon className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
              )}
              <span className="flex-1 text-[14px] leading-[20px] text-[#202124] truncate">{suggestion.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions; 