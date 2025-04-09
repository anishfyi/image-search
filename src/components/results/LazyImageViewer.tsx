import React, { Suspense } from 'react';
import { ImageResult } from '../../types/image';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load the ImageViewer component
const ImageViewer = React.lazy(() => import('./ImageViewer'));

interface LazyImageViewerProps {
  image: ImageResult | null;
  onClose: () => void;
}

const LazyImageViewer: React.FC<LazyImageViewerProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ImageViewer image={image} onClose={onClose} />
    </Suspense>
  );
};

export default LazyImageViewer; 