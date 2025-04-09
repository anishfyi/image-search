export interface ImageMetadata {
  similarity?: number;
  uploadedImage?: {
    width: number;
    height: number;
    type: string;
    size: string;
  };
}

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
  metadata?: ImageMetadata;
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