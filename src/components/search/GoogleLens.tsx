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
            <XMarkIcon className="w-6 h-6" />
          </button>
          <span className="text-white text-2xl font-medium">Google Lens</span>
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

      {/* Center section with camera view and viewfinder */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
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
        
        {/* Camera Overlay - Corner-rounded viewfinder */}
        <div className="absolute pointer-events-none z-20">
          <div className="relative w-[285px] h-[285px]">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/90 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/90 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/90 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/90 rounded-br-3xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Section */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Thumbnail and main search button */}
        <div className="flex justify-center mb-6 relative">
          {/* Plain white dot button */}
          <div className="absolute left-6 bottom-0">
          </div>
          
          {/* Main Search Button */}
          <button
            onClick={handleCapture}
            disabled={isProcessing || !isCameraReady}
            className="w-20 h-20 rounded-full bg-gray-400 focus:outline-none disabled:opacity-50 flex items-center justify-center shadow-lg"
            aria-label="Take photo"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="black" stroke-width="2.5" fill="none">
                  <path d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z" />
                  <path d="M16 16l4.5 4.5" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Bottom Tab Buttons */}
        <div className="flex justify-between px-8 pb-16">
          <button
            onClick={() => setSelectedMode('translate')}
            className="flex flex-col items-center focus:outline-none"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" />
              </svg>
            </div>
            <span className={`text-xs mt-1 ${selectedMode === 'translate' ? 'text-blue-400' : 'text-blue-300'}`}>
              Translate
            </span>
          </button>

          <button
            onClick={() => setSelectedMode('search')}
            className="flex flex-col items-center focus:outline-none"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
              </svg>
            </div>
            <span className={`text-xs mt-1 ${selectedMode === 'search' ? 'text-blue-400' : 'text-blue-300'}`}>
              Search
            </span>
          </button>

          <button
            onClick={() => setSelectedMode('homework')}
            className="flex flex-col items-center focus:outline-none"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
              </svg>
            </div>
            <span className={`text-xs mt-1 ${selectedMode === 'homework' ? 'text-blue-400' : 'text-blue-300'}`}>
              Homework
            </span>
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