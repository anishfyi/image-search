// Mock trending data - in a real app, this would come from an API
export const trendingSearches = [
  {
    id: 1,
    text: "price of h&m tote bag",
    category: "fashion",
    trending: true
  },
  {
    id: 2,
    text: "zara new launches",
    category: "fashion",
    trending: true
  },
  {
    id: 3,
    text: "lululemon track pants red",
    category: "clothing",
    trending: true
  },
  {
    id: 4,
    text: "nike air max 2024",
    category: "shoes",
    trending: true
  },
  {
    id: 5,
    text: "uniqlo spring collection",
    category: "fashion",
    trending: true
  },
  {
    id: 6,
    text: "adidas ultraboost sale",
    category: "shoes",
    trending: true
  }
];

export const getTrendingSearches = () => {
  // In a real app, this would be an API call
  return Promise.resolve(trendingSearches);
}; 