import { ImageResult, ImageSearchResponse } from '../types/image';
import { ImageService } from './imageService';

// Sample image data
const sampleImages: ImageResult[] = [
  {
    id: '1',
    title: 'Beautiful Mountain Landscape',
    url: 'https://source.unsplash.com/random/800x600?mountain',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?mountain',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.2 MB',
    type: 'JPEG'
  },
  {
    id: '2',
    title: 'Ocean Sunset',
    url: 'https://source.unsplash.com/random/800x600?ocean',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?ocean',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.5 MB',
    type: 'JPEG'
  },
  {
    id: '3',
    title: 'City Skyline',
    url: 'https://source.unsplash.com/random/800x600?city',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?city',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.8 MB',
    type: 'JPEG'
  },
  {
    id: '4',
    title: 'Forest Path',
    url: 'https://source.unsplash.com/random/800x600?forest',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?forest',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.3 MB',
    type: 'JPEG'
  },
  {
    id: '5',
    title: 'Desert Dunes',
    url: 'https://source.unsplash.com/random/800x600?desert',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?desert',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.4 MB',
    type: 'JPEG'
  },
  {
    id: '6',
    title: 'Beach Waves',
    url: 'https://source.unsplash.com/random/800x600?beach',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?beach',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.6 MB',
    type: 'JPEG'
  },
  {
    id: '7',
    title: 'Mountain Lake',
    url: 'https://source.unsplash.com/random/800x600?lake',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?lake',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.7 MB',
    type: 'JPEG'
  },
  {
    id: '8',
    title: 'Urban Street',
    url: 'https://source.unsplash.com/random/800x600?street',
    thumbnailUrl: 'https://source.unsplash.com/random/300x200?street',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.9 MB',
    type: 'JPEG'
  }
];

export class MockSearchService {
  private static instance: MockSearchService;
  private imageService: ImageService;
  private constructor() {
    this.imageService = ImageService.getInstance();
  }

  static getInstance(): MockSearchService {
    if (!MockSearchService.instance) {
      MockSearchService.instance = new MockSearchService();
    }
    return MockSearchService.instance;
  }

  async searchImages(
    query: string,
    page: number = 1,
    perPage: number = 8
  ): Promise<ImageSearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedResults = sampleImages.slice(startIndex, endIndex);

    return {
      results: paginatedResults,
      total: sampleImages.length,
      page,
      perPage,
    };
  }

  async searchByImage(
    file: File,
    page: number = 1,
    perPage: number = 8
  ): Promise<ImageSearchResponse> {
    try {
      // Process the uploaded image
      const imageData = await this.imageService.processImage(file);
      
      // Find similar images
      const similarImages = await this.imageService.findSimilarImages(imageData, sampleImages);
      
      // Apply pagination
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedResults = similarImages.slice(startIndex, endIndex).map(img => ({
        ...img,
        title: `Similar to ${file.name} - ${img.title}`,
        metadata: {
          ...img.metadata,
          similarity: (img as any).similarity,
          uploadedImage: {
            width: imageData.width,
            height: imageData.height,
            type: imageData.type,
            size: imageData.size,
          }
        }
      }));

      return {
        results: paginatedResults,
        total: similarImages.length,
        page,
        perPage,
      };
    } catch (error) {
      console.error('Error in searchByImage:', error);
      throw new Error('Failed to process image and find similar images');
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!query) return [];

    // Generate some mock suggestions based on the query
    const mockSuggestions = [
      `${query} images`,
      `${query} photos`,
      `${query} pictures`,
      `free ${query} images`,
      `${query} stock photos`,
    ];

    return mockSuggestions;
  }
} 