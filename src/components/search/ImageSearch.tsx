import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '../common/icons';
import GoogleLens from './GoogleLens';
import { NativeService } from '../../services/nativeService';

interface ImageSearchProps {
  onImageSelect: (file: File) => void;
  onError?: (error: string) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ onImageSelect, onError }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLens, setShowLens] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeService = NativeService.getInstance();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      onError?.('Image size should be less than 5MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelect(file);
  };

  const handleClick = async () => {
    try {
      const hasPermissions = await nativeService.checkPermissions();
      if (!hasPermissions) {
        onError?.('Camera permissions are required');
        return;
      }
      
      const imageUrl = await nativeService.takePicture();
      if (imageUrl) {
        setPreviewUrl(imageUrl);
        // Convert URL to File object
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'camera-image.jpg', { type: 'image/jpeg' });
        onImageSelect(file);
      }
    } catch (error) {
      onError?.('Failed to access camera. Please try again.');
      console.error('Camera error:', error);
    }
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
      handleImageSelect(file);
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center justify-center p-[9px] rounded-full transition-colors group ${
          isDragging
            ? 'bg-[#e8f0fe] text-[#1a73e8]'
            : 'hover:bg-[#f8f9fa] text-[#4285f4]'
        }`}
        type="button"
        aria-label="Search by image"
        title="Search by image"
      >
        <CameraIcon className="w-6 h-6 group-hover:text-[#1a73e8]" />
      </button>

      {previewUrl && (
        <div className="absolute top-[calc(100%+12px)] right-0 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-[#dadce0] overflow-hidden">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Search preview"
              className="w-[240px] h-[180px] object-cover"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-[rgba(32,33,36,0.6)] hover:bg-[rgba(32,33,36,0.8)] rounded-full text-white transition-colors"
              aria-label="Remove image"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="px-4 py-3 border-t border-[#dadce0]">
            <p className="text-[13px] leading-5 text-[#5f6368]">
              Search with this image
            </p>
          </div>
        </div>
      )}

      {showLens && (
        <GoogleLens
          onClose={() => setShowLens(false)}
        />
      )}
    </div>
  );
};

export default ImageSearch; 