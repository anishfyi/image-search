import React, { useRef, useEffect } from 'react';
import { ImageResult } from '../../types/image';
import AccessibleModal from '../common/AccessibleModal';

interface ImageViewerProps {
  image: ImageResult | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (image && imageRef.current) {
      imageRef.current.focus();
    }
  }, [image]);

  if (!image) return null;

  return (
    <AccessibleModal
      isOpen={!!image}
      onClose={onClose}
      title={image.title}
      initialFocusRef={imageRef as React.RefObject<HTMLElement>}
    >
      <div className="mt-4">
        <div className="relative">
          <img
            ref={imageRef}
            src={image.url}
            alt={image.title}
            className="max-h-[70vh] w-auto mx-auto"
            tabIndex={0}
            aria-label={`${image.title}. Press Escape to close.`}
          />
          {image.metadata?.similarity && (
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded"
              aria-label={`${Math.round(image.metadata.similarity * 100)}% similar`}
            >
              {Math.round(image.metadata.similarity * 100)}% similar
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Source: {image.source}</span>
            <span>Size: {image.size}</span>
          </div>

          {image.metadata?.uploadedImage && (
            <div className="text-sm text-gray-600">
              <p>
                Original image: {image.metadata.uploadedImage.width}x
                {image.metadata.uploadedImage.height} pixels
              </p>
              <p>Size: {image.metadata.uploadedImage.size}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close image viewer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </AccessibleModal>
  );
};

export default ImageViewer; 