import React, { useState, useEffect } from 'react';
import { ClockIcon, CalendarIcon, CloudIcon, NewspaperIcon } from '../common/icons';

interface FeedItem {
  id: string;
  type: 'weather' | 'news' | 'calendar' | 'quick-action';
  title: string;
  content: string;
  timestamp?: string;
  icon?: React.ReactNode;
}

const PersonalizedFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockFeedItems: FeedItem[] = [
      {
        id: '1',
        type: 'weather',
        title: 'Weather in Your Location',
        content: 'Sunny, 72°F',
        icon: <CloudIcon className="w-6 h-6" />
      },
      {
        id: '2',
        type: 'news',
        title: 'Top Stories',
        content: 'Breaking news and updates from around the world',
        icon: <NewspaperIcon className="w-6 h-6" />
      },
      {
        id: '3',
        type: 'calendar',
        title: 'Upcoming Events',
        content: 'Meeting with team at 2:00 PM',
        timestamp: 'Today, 2:00 PM',
        icon: <CalendarIcon className="w-6 h-6" />
      },
      {
        id: '4',
        type: 'quick-action',
        title: 'Quick Actions',
        content: 'Common tasks and shortcuts',
        icon: <ClockIcon className="w-6 h-6" />
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setFeedItems(mockFeedItems);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {feedItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-google p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-blue-500">{item.icon}</div>
            <h3 className="text-lg font-medium text-neutral-900">{item.title}</h3>
          </div>
          <p className="text-neutral-600 mb-2">{item.content}</p>
          {item.timestamp && (
            <div className="flex items-center text-sm text-neutral-500">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{item.timestamp}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PersonalizedFeed; 