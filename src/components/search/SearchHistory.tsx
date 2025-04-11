import React from 'react';
import { ClockIcon, XMarkIcon } from '../common/icons';
import { useSearch } from '../../context/SearchContext';

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  onClear: () => void;
  className?: string;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  onSelect, 
  onClear,
  className = ''
}) => {
  const { searchHistory, removeFromHistory } = useSearch();

  if (searchHistory.length === 0) return null;

  return (
    <div className={`py-[6px] ${className}`}>
      <div className="flex items-center justify-between px-4 py-[6px] mb-[2px]">
        <h3 className="text-[14px] leading-[22px] text-[#70757a]">Recent searches</h3>
        <button
          onClick={onClear}
          className="text-[14px] leading-[22px] text-[#70757a] hover:text-[#202124] focus:outline-none transition-colors"
          aria-label="Clear all history"
        >
          Clear all
        </button>
      </div>
      <ul className="py-[6px]">
        {searchHistory.map((item) => (
          <li 
            key={item.timestamp}
            className="relative group"
          >
            <button
              onClick={() => onSelect(item.query)}
              className="w-full px-4 py-[10px] text-left hover:bg-[#f8f9fa] flex items-center gap-3 group transition-colors"
            >
              <ClockIcon className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" aria-hidden="true" />
              <span className="flex-1 text-[14px] leading-[20px] text-[#202124] truncate pr-2">{item.query}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.timestamp);
                }}
                className="opacity-0 group-hover:opacity-100 p-[6px] hover:bg-[#f1f3f4] rounded-full transition-all"
                aria-label={`Remove "${item.query}" from history`}
              >
                <XMarkIcon className="w-[18px] h-[18px] text-[#70757a]" />
              </button>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory; 