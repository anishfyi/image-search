import React from 'react';
import { ShareIcon } from '../common/icons/index';
import { ImageResult } from '../../types/image';

interface ShareButtonProps {
  image: ImageResult;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ image, className = '' }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          text: `Check out this image: ${image.title}`,
          url: image.url,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(image.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share image. Please try again.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center space-x-2 px-4 py-2 text-sm text-[#1a73e8] hover:bg-[#f8f9fa] rounded-full transition-colors ${className}`}
      aria-label="Share image"
    >
      <ShareIcon className="w-5 h-5" />
      <span>Share</span>
    </button>
  );
};

export default ShareButton; 