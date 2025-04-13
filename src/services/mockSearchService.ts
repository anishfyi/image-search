import { ImageResult, ImageSearchResponse } from '../types/image';
import { ImageService } from './imageService';

// Sample image data
const sampleImages: ImageResult[] = [
  {
    id: '1',
    title: 'H&M Floral Summer Dress',
    url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop',
    source: 'H&M',
    width: 800,
    height: 600,
    size: '1.2 MB',
    type: 'JPEG'
  },
  {
    id: '2',
    title: 'Zara Spring Collection 2024',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=200&fit=crop',
    source: 'Zara',
    width: 800,
    height: 600,
    size: '1.5 MB',
    type: 'JPEG'
  },
  {
    id: '3',
    title: 'Uniqlo Basic T-Shirt Collection',
    url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=200&fit=crop',
    source: 'Uniqlo',
    width: 800,
    height: 600,
    size: '1.8 MB',
    type: 'JPEG'
  },
  {
    id: '4',
    title: 'Nike Air Max 2024',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    source: 'Nike',
    width: 800,
    height: 600,
    size: '1.3 MB',
    type: 'JPEG'
  },
  {
    id: '5',
    title: 'Adidas Training Collection',
    url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=200&fit=crop',
    source: 'Adidas',
    width: 800,
    height: 600,
    size: '1.4 MB',
    type: 'JPEG'
  },
  {
    id: '6',
    title: 'Mango Summer Essentials',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop',
    source: 'Mango',
    width: 800,
    height: 600,
    size: '1.6 MB',
    type: 'JPEG'
  },
  {
    id: '7',
    title: 'ASOS Trending Styles',
    url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300&h=200&fit=crop',
    source: 'ASOS',
    width: 800,
    height: 600,
    size: '1.7 MB',
    type: 'JPEG'
  },
  {
    id: '8',
    title: 'H&M Sustainable Collection',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=200&fit=crop',
    source: 'H&M',
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
    try {
      // Reduce delay for testing
      await new Promise(resolve => setTimeout(resolve, 300));

      // Filter images based on query
      const filteredImages = sampleImages.filter(image => 
        image.title.toLowerCase().includes(query.toLowerCase()) ||
        image.source.toLowerCase().includes(query.toLowerCase())
      );

      // If no matches found, return all images (like Google does)
      const results = filteredImages.length > 0 ? filteredImages : sampleImages;
      
      if (!results) {
        throw new Error('No results found');
      }

      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async searchByImage(file: File): Promise<ImageResult> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: file.name,
          url: URL.createObjectURL(file),
          thumbnailUrl: URL.createObjectURL(file),
          source: 'User Upload',
          width: 1920,
          height: 1080,
          type: file.type,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          similarImages: sampleImages.slice(0, 4).map(img => ({
            url: img.url,
            title: img.title,
            source: img.source
          })),
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