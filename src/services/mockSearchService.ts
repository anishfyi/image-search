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

  async searchByText(query: string): Promise<ImageResult[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Sample Image 1',
            url: 'https://example.com/image1.jpg',
            thumbnailUrl: 'https://example.com/thumb1.jpg',
            source: 'Example.com',
            width: 800,
            height: 600,
            type: 'image/jpeg',
            similarImages: [
              {
                url: 'https://example.com/similar1.jpg',
                title: 'Similar Image 1',
                source: 'Example.com'
              },
              {
                url: 'https://example.com/similar2.jpg',
                title: 'Similar Image 2',
                source: 'Example.com'
              }
            ],
            products: [
              {
                name: 'Product 1',
                price: '$99.99',
                merchant: 'Store 1',
                merchantLogo: 'https://example.com/store1-logo.png',
                url: 'https://example.com/product1'
              }
            ]
          }
        ]);
      }, 1000);
    });
  }

  async searchByImage(imagePath: string): Promise<ImageResult> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'Uploaded Image',
          url: imagePath,
          thumbnailUrl: imagePath,
          source: 'User Upload',
          width: 1920,
          height: 1080,
          type: 'image/jpeg',
          similarImages: [
            {
              url: 'https://example.com/similar1.jpg',
              title: 'Similar Image 1',
              source: 'Example.com'
            },
            {
              url: 'https://example.com/similar2.jpg',
              title: 'Similar Image 2',
              source: 'Example.com'
            }
          ],
          products: [
            {
              name: 'Product 1',
              price: '$99.99',
              merchant: 'Store 1',
              merchantLogo: 'https://example.com/store1-logo.png',
              url: 'https://example.com/product1'
            }
          ]
        });
      }, 1000);
    });
  }

  async getSuggestions(query: string): Promise<string[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          `${query} suggestion 1`,
          `${query} suggestion 2`,
          `${query} suggestion 3`
        ]);
      }, 300);
    });
  }
} 