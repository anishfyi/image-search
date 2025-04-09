import { ImageResult, ImageSearchResponse } from '../types/image';

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
  private constructor() {}

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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter images based on query
    const filteredImages = sampleImages.filter(image =>
      image.title.toLowerCase().includes(query.toLowerCase())
    );

    // Calculate pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);

    return {
      results: paginatedImages,
      total: filteredImages.length,
      page,
      perPage
    };
  }

  async getSuggestions(query: string): Promise<string[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return suggestions based on the query
    const suggestions = [
      `${query} landscape`,
      `${query} photography`,
      `${query} wallpaper`,
      `${query} hd`,
      `${query} 4k`
    ];

    return suggestions;
  }
} 