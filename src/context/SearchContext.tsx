import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MockSearchService } from '../services/mockSearchService';
import { ImageResult, ImageSearchResponse } from '../types/image';

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
  isImageSearch?: boolean;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  search: () => void;
  searchByImage: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  searchHistory: SearchHistoryItem[];
  clearHistory: () => void;
  removeFromHistory: (timestamp: number) => void;
  results: ImageResult[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  suggestions: string[];
  getSuggestions: (query: string) => void;
}

const HISTORY_STORAGE_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;
const RESULTS_PER_PAGE = 8;

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
  const [results, setResults] = useState<ImageResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const searchService = MockSearchService.getInstance();

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = (query: string, filters: SearchFilters, isImageSearch = false) => {
    const newItem: SearchHistoryItem = {
      query,
      filters,
      timestamp: Date.now(),
      isImageSearch,
    };

    setSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => 
        item.query !== query || item.isImageSearch !== isImageSearch
      );
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
      const response = await searchService.searchImages(
        query.trim(),
        currentPage,
        RESULTS_PER_PAGE
      );
      setResults(response.results);
      setTotalPages(Math.ceil(response.total / RESULTS_PER_PAGE));
      addToHistory(query.trim(), filters);
    } catch (err) {
      setError('An error occurred during the search');
      setResults([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const searchByImage = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const response = await searchService.searchByImage(file, 1, RESULTS_PER_PAGE);
      setResults(response.results);
      setTotalPages(Math.ceil(response.total / RESULTS_PER_PAGE));
      addToHistory(file.name, filters, true);
    } catch (err) {
      setError('Failed to search by image. Please try again.');
      console.error('Image search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestions = await searchService.getSuggestions(query.trim());
      setSuggestions(suggestions);
    } catch (err) {
      setSuggestions([]);
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
        searchByImage,
        isLoading,
        error,
        searchHistory,
        clearHistory,
        removeFromHistory,
        results,
        currentPage,
        totalPages,
        setCurrentPage,
        suggestions,
        getSuggestions,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}; 