import React from 'react';
import { ImageResult } from '../../types/image';

interface ImageAnalysisProps {
  image: ImageResult;
  mode: 'search' | 'translate' | 'homework';
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ image, mode }) => {
  return (
    <div className="bg-white rounded-lg shadow-google p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-neutral-900">About this image</h2>
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-500">Size:</span>
            <span className="text-sm text-neutral-900">
              {image.width} × {image.height} pixels
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-500">Format:</span>
            <span className="text-sm text-neutral-900">{image.type}</span>
          </div>
        </div>
      </div>

      {mode === 'search' && (
        <div className="space-y-4">
          {image.detectedObjects && image.detectedObjects.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-neutral-900">Detected Objects</h3>
              <div className="mt-2 space-y-2">
                {image.detectedObjects.map((obj, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-900">{obj.label}</span>
                    <span className="text-sm text-neutral-500">
                      {Math.round(obj.confidence * 100)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-md font-medium text-neutral-900">Visual matches</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {image.similarImages?.slice(0, 4).map((similar, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={similar.url}
                    alt={`Similar image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {image.products && image.products.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-neutral-900">Products</h3>
              <div className="mt-2 space-y-2">
                {image.products.map((product, index) => (
                  <a
                    key={index}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:bg-neutral-50 p-2 rounded"
                  >
                    <img
                      src={product.merchantLogo}
                      alt={product.merchant}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-neutral-900">{product.name}</span>
                    <span className="text-sm text-neutral-500">{product.price}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'translate' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-neutral-900">Detected text</h3>
            <div className="mt-2 p-2 bg-neutral-50 rounded">
              <p className="text-sm text-neutral-900">{image.detectedText}</p>
            </div>
          </div>
          <div>
            <h3 className="text-md font-medium text-neutral-900">Translation</h3>
            <div className="mt-2 p-2 bg-neutral-50 rounded">
              <p className="text-sm text-neutral-900">{image.translation}</p>
            </div>
          </div>
        </div>
      )}

      {mode === 'homework' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-neutral-900">Problem analysis</h3>
            <div className="mt-2 p-2 bg-neutral-50 rounded">
              <p className="text-sm text-neutral-900">{image.problemAnalysis}</p>
            </div>
          </div>
          <div>
            <h3 className="text-md font-medium text-neutral-900">Solution</h3>
            <div className="mt-2 p-2 bg-neutral-50 rounded">
              <p className="text-sm text-neutral-900">{image.solution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis; 