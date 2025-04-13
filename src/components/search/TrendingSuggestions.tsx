import React from 'react';
import { MagnifyingGlassIcon, NewspaperIcon } from '../common/icons';

interface TrendingSuggestionsProps {
  suggestions: Array<{
    id: number;
    text: string;
    category: string;
    trending: boolean;
  }>;
  onSelect: (suggestion: string) => void;
  theme?: 'dark' | 'light';
}

const TrendingSuggestions: React.FC<TrendingSuggestionsProps> = ({ suggestions, onSelect, theme = 'light' }) => {
  return (
    <div className="py-4">
      <div className={`px-4 mb-2 text-sm ${
        theme === 'dark' ? 'text-[#9aa0a6]' : 'text-[#70757a]'
      }`}>
        Trending searches
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.text)}
            className={`w-full px-4 py-2 flex items-center gap-3 text-sm ${
              theme === 'dark'
                ? 'hover:bg-[#3c4043] text-[#e8eaed]'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {suggestion.trending ? (
              <NewspaperIcon className={`w-5 h-5 ${
                theme === 'dark' ? 'text-[#9aa0a6]' : 'text-[#70757a]'
              }`} />
            ) : (
              <MagnifyingGlassIcon className={`w-5 h-5 ${
                theme === 'dark' ? 'text-[#9aa0a6]' : 'text-[#70757a]'
              }`} />
            )}
            <span className="flex-1 text-left">{suggestion.text}</span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-[#9aa0a6]' : 'text-[#70757a]'
            }`}>
              {suggestion.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSuggestions; 