import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SearchFilters {
  size: string;
  color: string;
  type: string;
  time: string;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  filters: SearchFilters;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  search: () => void;
  isLoading: boolean;
  error: string | null;
  searchHistory: SearchHistoryItem[];
  clearHistory: () => void;
  removeFromHistory: (timestamp: number) => void;
}

const HISTORY_STORAGE_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    size: 'any',
    color: 'any',
    type: 'any',
    time: 'any',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = (query: string, filters: SearchFilters) => {
    const newItem: SearchHistoryItem = {
      query,
      filters,
      timestamp: Date.now(),
    };

    setSearchHistory(prevHistory => {
      // Remove duplicates and keep only the most recent entries
      const filteredHistory = prevHistory.filter(item => item.query !== query);
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  };

  const removeFromHistory = (timestamp: number) => {
    setSearchHistory(prevHistory =>
      prevHistory.filter(item => item.timestamp !== timestamp)
    );
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const search = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual search API call
      console.log('Searching with:', { query, filters });
      // Add to history before the API call
      addToHistory(query.trim(), filters);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('An error occurred during the search');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        filters,
        setFilters,
        search,
        isLoading,
        error,
        searchHistory,
        clearHistory,
        removeFromHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}; 