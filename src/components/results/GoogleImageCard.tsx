import React from 'react';
import { ImageResult } from '../../types/image';
import ShareButton from './ShareButton';

interface GoogleImageCardProps {
  result: ImageResult;
  onSelect: (result: ImageResult) => void;
}

const GoogleImageCard: React.FC<GoogleImageCardProps> = ({ result, onSelect }) => {
  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] transition-all duration-200"
      onClick={() => onSelect(result)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(result);
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={result.thumbnailUrl}
          alt={result.title}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
          loading="lazy"
        />
        {/* Similarity Badge */}
        {result.metadata?.similarity && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-full">
            {Math.round(result.metadata.similarity * 100)}% similar
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
      </div>

      {/* Content Container */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-[13px] font-normal text-[#202124] mb-1 line-clamp-2 leading-[1.3]">
          {result.title}
        </h3>

        {/* Source and Size */}
        <div className="flex items-center justify-between text-[11px] text-[#70757a]">
          <span className="truncate">{result.source}</span>
          <span className="ml-2 whitespace-nowrap">{result.size}</span>
        </div>

        {/* Share Button */}
        <div className="mt-2 flex justify-end">
          <ShareButton image={result} />
        </div>

        {/* Uploaded Image Info */}
        {result.metadata?.uploadedImage && (
          <div className="mt-2 text-[11px] text-[#70757a]">
            <p>Uploaded image: {result.metadata.uploadedImage.width}x{result.metadata.uploadedImage.height}</p>
            <p>Size: {result.metadata.uploadedImage.size}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleImageCard; 