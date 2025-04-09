import React from 'react';
import { ClockIcon, XMarkIcon, TrashIcon } from '../common/icons';
import { useSearch } from '../../context/SearchContext';

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  className?: string;
  selectedIndex: number;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  onSelect, 
  className = '',
  selectedIndex 
}) => {
  const { searchHistory, removeFromHistory, clearHistory } = useSearch();

  if (searchHistory.length === 0) return null;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      }
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-google border border-neutral-border ${className}`}
      role="listbox"
      aria-label="Search history"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-border">
        <h3 className="text-sm font-medium text-neutral-900">Recent searches</h3>
        <button
          onClick={clearHistory}
          className="flex items-center space-x-1.5 text-sm text-neutral-500 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Clear all history"
        >
          <TrashIcon className="w-4 h-4" aria-hidden="true" />
          <span>Clear all</span>
        </button>
      </div>
      <ul className="py-2">
        {searchHistory.map((item, index) => (
          <li 
            key={item.timestamp}
            className="relative group"
            role="option"
            aria-selected={index === selectedIndex}
          >
            <div
              onClick={() => onSelect(item.query)}
              className={`w-full px-4 py-2.5 text-left hover:bg-neutral-hover flex items-center space-x-3 group cursor-pointer ${
                index === selectedIndex ? 'bg-neutral-hover' : ''
              }`}
              id={`history-${index}`}
            >
              <ClockIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-700 truncate">{item.query}</p>
                <p className="text-xs text-neutral-400">{formatTimestamp(item.timestamp)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.timestamp);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-100 rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label={`Remove "${item.query}" from history`}
              >
                <XMarkIcon className="w-4 h-4 text-neutral-400" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory; 