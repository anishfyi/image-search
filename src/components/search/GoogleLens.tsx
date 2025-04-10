import React, { useState } from 'react';
import { XMarkIcon, ArrowLeftIcon, ClockIcon, EllipsisHorizontalIcon } from '../common/icons/index';
import { NativeService } from '../../services/nativeService';

interface GoogleLensProps {
  onClose: () => void;
}

const GoogleLens: React.FC<GoogleLensProps> = ({ onClose }) => {
  const [selectedMode, setSelectedMode] = useState<'translate' | 'search' | 'homework'>('search');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nativeService = NativeService.getInstance();

  const handleCapture = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      const imageUrl = await nativeService.takePicture();
      if (imageUrl) {
        // Process the image based on selected mode
        switch (selectedMode) {
          case 'translate':
            // Handle translation
            break;
          case 'search':
            // Handle search
            break;
          case 'homework':
            // Handle homework
            break;
        }
      }
    } catch (err) {
      setError('Failed to capture image. Please try again.');
      console.error('Camera error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <img src="/google-lens-logo.svg" alt="Google Lens" className="h-8" />
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Recent searches"
          >
            <ClockIcon className="w-6 h-6" />
          </button>
          <button
            className="text-white p-2 rounded-full hover:bg-white/10"
            aria-label="More options"
          >
            <EllipsisHorizontalIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {/* Camera preview will be rendered here by Capacitor */}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/90 px-4 py-6">
        <div className="flex justify-center mb-6">
          {/* Capture Button */}
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-16 h-16 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 disabled:opacity-50"
            aria-label="Take photo"
          >
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedMode('translate')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedMode === 'translate' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            Translate
          </button>
          <button
            onClick={() => setSelectedMode('search')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedMode === 'search' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setSelectedMode('homework')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedMode === 'homework' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            Homework
          </button>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="bg-red-500 text-white px-4 py-2 rounded text-center">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleLens; 