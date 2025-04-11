import React from 'react';
import { ClockIcon, NewspaperIcon } from '../common/icons';

interface TrendingSuggestionsProps {
  suggestions: Array<{
    id: number;
    text: string;
    category: string;
    trending: boolean;
  }>;
  onSelect: (suggestion: string) => void;
}

const TrendingSuggestions: React.FC<TrendingSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <ul className="w-full">
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          onClick={() => onSelect(suggestion.text)}
        >
          {suggestion.trending ? (
            <NewspaperIcon className="h-5 w-5 text-blue-500" />
          ) : (
            <ClockIcon className="h-5 w-5 text-gray-400" />
          )}
          <span>{suggestion.text}</span>
          <span className="text-sm text-gray-500 ml-auto">{suggestion.category}</span>
        </li>
      ))}
    </ul>
  );
};

export default TrendingSuggestions; 