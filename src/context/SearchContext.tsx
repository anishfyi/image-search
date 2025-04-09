import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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
  search: () => Promise<void>;
  searchByImage: (file: File) => Promise<ImageResult>;
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

  const search = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Mock API call
      const mockResults: ImageResult[] = [
        {
          id: '1',
          url: 'https://example.com/image1.jpg',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          title: 'Sample Image 1',
          source: 'Example.com',
          width: 800,
          height: 600,
          format: 'JPEG',
          similarImages: [
            { url: 'https://example.com/similar1.jpg', similarity: 0.95 },
            { url: 'https://example.com/similar2.jpg', similarity: 0.92 }
          ],
          products: [
            {
              name: 'Sample Product',
              price: '$99.99',
              merchant: 'Amazon',
              merchantLogo: 'https://example.com/amazon-logo.png'
            }
          ]
        }
      ];

      setResults(mockResults);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const searchByImage = useCallback(async (file: File): Promise<ImageResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock image analysis
      const mockResult: ImageResult = {
        id: '1',
        url: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        title: 'Analyzed Image',
        source: 'Google Lens',
        width: 800,
        height: 600,
        format: file.type.split('/')[1].toUpperCase(),
        similarImages: [
          { url: 'https://example.com/similar1.jpg', similarity: 0.95 },
          { url: 'https://example.com/similar2.jpg', similarity: 0.92 }
        ],
        products: [
          {
            name: 'Sample Product',
            price: '$99.99',
            merchant: 'Amazon',
            merchantLogo: 'https://example.com/amazon-logo.png'
          }
        ],
        detectedText: 'Sample text detected in image',
        translation: 'Translated text',
        problemAnalysis: 'This appears to be a math problem about...',
        solution: 'The solution to the problem is...'
      };

      return mockResult;
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Image analysis error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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