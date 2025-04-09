export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  source: string;
  width: number;
  height: number;
  format?: string;
  similarImages?: Array<{
    url: string;
    similarity: number;
  }>;
  products?: Array<{
    name: string;
    price: string;
    merchant: string;
    merchantLogo: string;
  }>;
  detectedText?: string;
  translation?: string;
  problemAnalysis?: string;
  solution?: string;
  size?: string;
  type?: string;
} 