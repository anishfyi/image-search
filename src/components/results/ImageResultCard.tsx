import React from 'react';
import { ImageResult } from '../../types/image';

interface ImageResultCardProps {
  result: ImageResult;
}

const ImageResultCard: React.FC<ImageResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        <img
          src={result.thumbnailUrl}
          alt={result.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
          {result.title}
        </h3>
        <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500 space-y-0.5">
          <p className="truncate">{result.source}</p>
          <p className="truncate">{result.size} • {result.type}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageResultCard; 