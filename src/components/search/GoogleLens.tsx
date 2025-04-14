import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ArrowLeftIcon, ClockIcon, EllipsisHorizontalIcon } from '../common/icons/index';
import { NativeService } from '../../services/nativeService';
import { IonIcon } from '@ionic/react';
import { camera } from 'ionicons/icons';

interface GoogleLensProps {
  onClose: () => void;
  onImageCapture?: (imageDataUrl: string) => void;
}

const GoogleLens: React.FC<GoogleLensProps> = ({ onClose, onImageCapture }) => {
  const [selectedMode, setSelectedMode] = useState<'translate' | 'search' | 'homework'>('search');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nativeService = NativeService.getInstance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initializeCamera = async () => {
      setCameraLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (!isMounted) return;
            videoRef.current?.play();
            setIsCameraReady(true);
            setCameraLoading(false);
          };
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error accessing camera:', error);
        setError('Failed to access camera. Please check permissions.');
        setCameraLoading(false);
      }
    };

    initializeCamera();

    return () => {
      isMounted = false;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !isCameraReady) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Capture image from video stream
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Process the image based on selected mode
        switch (selectedMode) {
          case 'translate':
            // Handle translation
            break;
          case 'search':
            // Handle search - pass to parent component if callback exists
            if (onImageCapture) {
              onImageCapture(imageData);
            }
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
      <div className="flex items-center justify-between px-4 py-3 z-10 relative">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <span className="text-white text-2xl font-medium">Google</span>
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
      <div className="flex-1 relative overflow-hidden">
        {/* Camera preview */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover absolute inset-0"
          playsInline
        />
        
        {/* Camera loading indicator */}
        {cameraLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Camera Overlay - Square viewfinder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-[280px] h-[280px] border border-white rounded-md" />
        </div>
      </div>

      {/* Bottom Controls - Fixed position to ensure visibility */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-16">
        {/* Capture Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={handleCapture}
            disabled={isProcessing || !isCameraReady}
            className="w-20 h-20 rounded-full bg-gray-200 focus:outline-none disabled:opacity-50 flex items-center justify-center shadow-lg"
            aria-label="Take photo"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <IonIcon icon={camera} className="text-black text-3xl" />
              </div>
            )}
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center space-x-8 px-4">
          <button
            onClick={() => setSelectedMode('translate')}
            className="text-center focus:outline-none"
          >
            <div className={`px-6 py-2 rounded-full text-sm font-medium ${
              selectedMode === 'translate' 
                ? 'bg-white text-black' 
                : 'text-white'
            }`}>
              Translate
            </div>
          </button>
          <button
            onClick={() => setSelectedMode('search')}
            className="text-center focus:outline-none"
          >
            <div className={`px-6 py-2 rounded-full text-sm font-medium ${
              selectedMode === 'search' 
                ? 'bg-white text-black' 
                : 'text-white'
            }`}>
              Search
            </div>
          </button>
          <button
            onClick={() => setSelectedMode('homework')}
            className="text-center focus:outline-none"
          >
            <div className={`px-6 py-2 rounded-full text-sm font-medium ${
              selectedMode === 'homework' 
                ? 'bg-white text-black' 
                : 'text-white'
            }`}>
              Homework
            </div>
          </button>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-48 left-0 right-0 px-4 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded text-center shadow-lg">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleLens; 