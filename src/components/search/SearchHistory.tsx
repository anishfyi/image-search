import React from 'react';
import { ClockIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSearch } from '../../context/SearchContext';

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  className?: string;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelect, className = '' }) => {
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
    <div className={`bg-white rounded-lg shadow-lg border border-neutral-border ${className}`}>
      <div className="flex items-center justify-between p-3 border-b border-neutral-border">
        <h3 className="text-sm font-medium text-neutral-text">Recent searches</h3>
        <button
          onClick={clearHistory}
          className="text-neutral-secondary hover:text-neutral-text flex items-center space-x-1 text-sm"
          aria-label="Clear all history"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Clear all</span>
        </button>
      </div>
      <ul className="py-2">
        {searchHistory.map((item) => (
          <li key={item.timestamp} className="relative group">
            <button
              onClick={() => onSelect(item.query)}
              className="w-full px-4 py-2 text-left hover:bg-neutral-hover flex items-center space-x-3"
            >
              <ClockIcon className="w-4 h-4 text-neutral-secondary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-text truncate">{item.query}</p>
                <p className="text-xs text-neutral-secondary">{formatTimestamp(item.timestamp)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.timestamp);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-hover rounded-full transition-opacity"
                aria-label={`Remove "${item.query}" from history`}
              >
                <XMarkIcon className="w-4 h-4 text-neutral-secondary" />
              </button>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory; 