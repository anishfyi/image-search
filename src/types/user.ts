export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  preferences: {
    theme: 'light' | 'dark';
    widgets: {
      weather: boolean;
      news: boolean;
      discover: boolean;
    };
    newsCategories: string[];
    location?: {
      lat: number;
      lng: number;
      name: string;
    };
  };
  lastLogin: number;
  createdAt: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  widgets: {
    weather: boolean;
    news: boolean;
    discover: boolean;
  };
  newsCategories: string[];
} 