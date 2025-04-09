import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageCropper from './ImageCropper';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onError?: (error: string) => void;
}

interface UploadError {
  type: 'size' | 'type' | 'load' | 'process' | 'dimensions' | 'network';
  message: string;
  details?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = { width: 50, height: 50 };
const MAX_DIMENSIONS = { width: 5000, height: 5000 };
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onError }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<UploadError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = (error: UploadError) => {
    setError(error);
    onError?.(error.message);
    setIsLoading(false);
  };

  const validateDimensions = async (file: File): Promise<ImageDimensions | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  };

  const validateFile = async (file: File): Promise<UploadError | null> => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        type: 'size',
        message: 'File size exceeds 5MB limit',
        details: `File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      };
    }

    // Check file type
    if (!VALID_TYPES.includes(file.type)) {
      return {
        type: 'type',
        message: 'Invalid file type. Please upload JPEG, PNG, or GIF',
        details: `Provided type: ${file.type}`
      };
    }

    // Check dimensions
    try {
      const dimensions = await validateDimensions(file);
      if (!dimensions) {
        return {
          type: 'load',
          message: 'Failed to load image dimensions',
          details: 'The image file may be corrupted'
        };
      }

      if (dimensions.width < MIN_DIMENSIONS.width || dimensions.height < MIN_DIMENSIONS.height) {
        return {
          type: 'dimensions',
          message: 'Image dimensions too small',
          details: `Minimum dimensions: ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`
        };
      }

      if (dimensions.width > MAX_DIMENSIONS.width || dimensions.height > MAX_DIMENSIONS.height) {
        return {
          type: 'dimensions',
          message: 'Image dimensions too large',
          details: `Maximum dimensions: ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height}px`
        };
      }
    } catch (err) {
      return {
        type: 'load',
        message: 'Failed to validate image dimensions',
        details: err instanceof Error ? err.message : 'Unknown error'
      };
    }

    return null;
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        handleError({
          type: 'size',
          message: 'File size exceeds 5MB limit',
          details: `Maximum size: 5MB`
        });
      } else if (error.code === 'file-invalid-type') {
        handleError({
          type: 'type',
          message: 'Invalid file type. Please upload JPEG, PNG, or GIF',
          details: `Accepted types: ${VALID_TYPES.join(', ')}`
        });
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setIsLoading(true);
      
      try {
        const validationError = await validateFile(file);
        if (validationError) {
          handleError(validationError);
          return;
        }

        setSelectedFile(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
          setShowCropper(true);
          setIsLoading(false);
        };
        reader.onerror = () => {
          handleError({
            type: 'load',
            message: 'Failed to load image. Please try again.',
            details: reader.error?.message || 'Unknown error'
          });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        handleError({
          type: 'process',
          message: 'Failed to process image',
          details: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleCropComplete = useCallback((croppedImage: string) => {
    setIsLoading(true);
    // Convert base64 to File
    fetch(croppedImage)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.blob();
      })
      .then(blob => {
        const file = new File([blob], selectedFile?.name || 'cropped-image.jpg', {
          type: 'image/jpeg'
        });
        onImageSelect(file);
        setPreview(croppedImage);
        setShowCropper(false);
        setIsLoading(false);
        setRetryCount(0);
      })
      .catch((err) => {
        handleError({
          type: 'process',
          message: 'Failed to process cropped image',
          details: err instanceof Error ? err.message : 'Unknown error'
        });
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
        }
      });
  }, [selectedFile, onImageSelect, retryCount]);

  const handleCancelCrop = useCallback(() => {
    setShowCropper(false);
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setRetryCount(0);
  }, []);

  const resetUpload = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setShowCropper(false);
    setRetryCount(0);
  }, [preview]);

  const retryUpload = useCallback(() => {
    if (selectedFile) {
      setError(null);
      onDrop([selectedFile], []);
    }
  }, [selectedFile, onDrop]);

  return (
    <div className="w-full" role="region" aria-label="Image upload">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          role="button"
          aria-label="Upload image area"
          aria-busy={isLoading}
          tabIndex={0}
        >
          <input {...getInputProps()} disabled={isLoading} aria-label="File input" />
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex justify-center" role="status" aria-label="Loading">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              </div>
            ) : (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-xs text-gray-500">
              Supports: JPEG, PNG, GIF (max 5MB)
              <br />
              Dimensions: {MIN_DIMENSIONS.width}x{MIN_DIMENSIONS.height}px to {MAX_DIMENSIONS.width}x{MAX_DIMENSIONS.height}px
            </p>
          </div>
        </div>
      ) : (
        <div className="relative" role="region" aria-label="Image preview">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={resetUpload}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Remove image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div 
          className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center text-red-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium">{error.message}</p>
              {error.details && (
                <p className="text-xs mt-1 text-red-500">{error.details}</p>
              )}
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={retryUpload}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
              disabled={retryCount >= 3}
            >
              {retryCount >= 3 ? 'Too many retries' : 'Try again'}
            </button>
            <button
              onClick={resetUpload}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Choose different file
            </button>
          </div>
        </div>
      )}

      {showCropper && preview && (
        <ImageCropper
          image={preview}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  );
};

export default ImageUpload; 