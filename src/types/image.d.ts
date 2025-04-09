export interface ImageResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  source: string;
  width: number;
  height: number;
  size: string;
  type: string;
}

export interface ImageSearchResponse {
  results: ImageResult[];
  total: number;
  page: number;
  perPage: number;
}

export interface ImageSearchState {
  results: ImageResult[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  perPage: number;
} 