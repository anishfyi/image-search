import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageCropper from './ImageCropper';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

interface UploadError {
  type: 'size' | 'type' | 'load' | 'process';
  message: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<UploadError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file: File): UploadError | null => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return {
        type: 'size',
        message: 'File size exceeds 5MB limit'
      };
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        type: 'type',
        message: 'Invalid file type. Please upload JPEG, PNG, or GIF'
      };
    }

    return null;
  };

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setError({
          type: 'size',
          message: 'File size exceeds 5MB limit'
        });
      } else if (error.code === 'file-invalid-type') {
        setError({
          type: 'type',
          message: 'Invalid file type. Please upload JPEG, PNG, or GIF'
        });
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsLoading(true);
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setShowCropper(true);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError({
          type: 'load',
          message: 'Failed to load image. Please try again.'
        });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleCropComplete = (croppedImage: string) => {
    setIsLoading(true);
    // Convert base64 to File
    fetch(croppedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], selectedFile?.name || 'cropped-image.jpg', {
          type: 'image/jpeg'
        });
        onImageSelect(file);
        setPreview(croppedImage);
        setShowCropper(false);
        setIsLoading(false);
      })
      .catch(() => {
        setError({
          type: 'process',
          message: 'Failed to process image. Please try again.'
        });
        setIsLoading(false);
      });
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  };

  const resetUpload = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setShowCropper(false);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={isLoading} />
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex justify-center">
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
            <p className="text-xs text-gray-500">Supports: JPEG, PNG, GIF (max 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={resetUpload}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            disabled={isLoading}
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
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
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
            <p className="text-sm">{error.message}</p>
          </div>
          <button
            onClick={resetUpload}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Try again
          </button>
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