import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageSearchProps {
  onImageSelect: (file: File) => void;
  onError?: (error: string) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ onImageSelect, onError }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      onError?.('Image size should be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Pass the file to parent component
    onImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          isDragging
            ? 'bg-blue-50 text-blue-600'
            : 'hover:bg-neutral-100 text-neutral-500'
        }`}
        aria-label="Search by image"
        title="Search by image"
      >
        <CameraIcon className="w-5 h-5" />
      </button>

      {previewUrl && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-google border border-neutral-border overflow-hidden">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Search preview"
              className="w-[240px] h-[180px] object-cover"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              aria-label="Remove image"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 border-t border-neutral-border">
            <p className="text-xs text-neutral-500">
              Search with this image
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSearch; 