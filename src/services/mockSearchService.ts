import { ImageResult, ImageSearchResponse } from '../types/image';
import { ImageService } from './imageService';

// Sample image data
const sampleImages: ImageResult[] = [
  {
    id: '1',
    title: 'Beautiful Mountain Landscape',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.2 MB',
    type: 'JPEG'
  },
  {
    id: '2',
    title: 'Ocean Sunset',
    url: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.5 MB',
    type: 'JPEG'
  },
  {
    id: '3',
    title: 'City Skyline',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.8 MB',
    type: 'JPEG'
  },
  {
    id: '4',
    title: 'Forest Path',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.3 MB',
    type: 'JPEG'
  },
  {
    id: '5',
    title: 'Desert Dunes',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.4 MB',
    type: 'JPEG'
  },
  {
    id: '6',
    title: 'Beach Waves',
    url: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.6 MB',
    type: 'JPEG'
  },
  {
    id: '7',
    title: 'Mountain Lake',
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=300&h=200&fit=crop',
    source: 'Unsplash',
    width: 800,
    height: 600,
    size: '1.7 MB',
    type: 'JPEG'
  },
  {
    id: '8',
    title: 'Urban Street',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=200&fit=crop',
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