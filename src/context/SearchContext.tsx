import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageResult } from '../types/image';
import { MockSearchService } from '../services/mockSearchService';

interface SearchContextType {
  searchResults: ImageResult[];
  searchHistory: Array<{ query: string; timestamp: number }>;
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  query: string;
  searchByText: (query: string) => Promise<void>;
  searchByImage: (file: File) => Promise<ImageResult>;
  getSuggestions: (query: string) => Promise<void>;
  clearResults: () => void;
  setCurrentPage: (page: number) => void;
  setQuery: (query: string) => void;
  removeFromHistory: (timestamp: number) => void;
  clearHistory: () => void;
}

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
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; timestamp: number }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');

  const searchService = MockSearchService.getInstance();

  const searchByText = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchService.searchByText(query);
      setSearchResults(results);
      setTotalPages(Math.ceil(results.length / 12)); // Assuming 12 items per page
      setSearchHistory(prev => [...prev, { query, timestamp: Date.now() }].slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during search');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchByImage = async (file: File): Promise<ImageResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await searchService.searchByImage(file);
      setSearchResults([result]);
      setTotalPages(1);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during image search');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (query: string) => {
    try {
      const results = await searchService.getSuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Suggestions error:', error);
      throw error;
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
    setCurrentPage(1);
    setTotalPages(1);
  };

  const removeFromHistory = (timestamp: number) => {
    setSearchHistory(prev => prev.filter(item => item.timestamp !== timestamp));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        searchHistory,
        suggestions,
        isLoading,
        error,
        currentPage,
        totalPages,
        query,
        searchByText,
        searchByImage,
        getSuggestions,
        clearResults,
        setCurrentPage,
        setQuery,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}; 