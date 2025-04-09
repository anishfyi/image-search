import React from 'react';

interface SearchSuggestion {
  text: string;
  type: 'history' | 'suggestion';
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  className = '',
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className={`absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg ${className}`}>
      <ul className="py-2">
        {suggestions.map((suggestion, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(suggestion.text)}
              className="w-full px-4 py-2 text-left text-sm text-neutral-text hover:bg-neutral-hover flex items-center space-x-3"
            >
              {suggestion.type === 'history' ? (
                <svg
                  className="w-4 h-4 text-neutral-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-neutral-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
              <span>{suggestion.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions; 