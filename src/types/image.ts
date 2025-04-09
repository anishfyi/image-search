export interface ImageResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  source: string;
  width: number;
  height: number;
  size?: string;
  type: string;
  metadata?: {
    [key: string]: any;
  };
  // New fields for object detection and OCR
  detectedObjects?: Array<{
    label: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  detectedText?: string;
  translation?: string;
  problemAnalysis?: string;
  solution?: string;
  similarImages?: Array<{
    url: string;
    title: string;
    source: string;
  }>;
  products?: Array<{
    name: string;
    price: string;
    merchant: string;
    merchantLogo: string;
    url: string;
  }>;
} 