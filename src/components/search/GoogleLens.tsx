import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, XMarkIcon } from '../common/icons';
import { useSearch } from '../../context/SearchContext';
import ImageAnalysis from './ImageAnalysis';
import { ImageResult } from '../../types/image';

interface GoogleLensProps {
  onClose: () => void;
}

const GoogleLens: React.FC<GoogleLensProps> = ({ onClose }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'search' | 'translate' | 'homework'>('search');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ImageResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { searchByImage } = useSearch();

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions and try again.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleFlash = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      if ('torch' in capabilities) {
        videoTrack.applyConstraints({
          advanced: [{ torch: !isFlashOn } as any]
        });
        setIsFlashOn(!isFlashOn);
      }
    }
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(1, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.applyConstraints({
        advanced: [{ zoom: newZoom } as any]
      });
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        try {
          const result = await searchByImage(file);
          // Format size as string
          const formattedResult = {
            ...result,
            size: result.size ? `${result.size} bytes` : undefined
          };
          setAnalysisResult(formattedResult);
          stopCamera();
        } catch (err) {
          setError('Failed to analyze image. Please try again.');
          console.error('Image analysis error:', err);
        }
      }
    }, 'image/jpeg');
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50">
        <button
          onClick={onClose}
          className="text-white p-2 rounded-full hover:bg-white/10"
          aria-label="Close camera"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMode('search')}
            className={`px-4 py-2 rounded-full ${
              selectedMode === 'search' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setSelectedMode('translate')}
            className={`px-4 py-2 rounded-full ${
              selectedMode === 'translate' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            Translate
          </button>
          <button
            onClick={() => setSelectedMode('homework')}
            className={`px-4 py-2 rounded-full ${
              selectedMode === 'homework' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            Homework
          </button>
        </div>
      </div>

      {!isCameraActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={startCamera}
            className="flex flex-col items-center text-white"
          >
            <CameraIcon className="w-16 h-16 mb-4" />
            <span className="text-lg">Open Camera</span>
          </button>
          {error && (
            <p className="text-red-500 mt-4 text-center">{error}</p>
          )}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4 bg-black/50">
            <button
              onClick={toggleFlash}
              className="text-white p-2 rounded-full hover:bg-white/10"
              aria-label={isFlashOn ? 'Turn off flash' : 'Turn on flash'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </button>
            <button
              onClick={captureImage}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-200"
              aria-label="Take photo"
            />
            <button
              onClick={() => handleZoom(0.1)}
              className="text-white p-2 rounded-full hover:bg-white/10"
              aria-label="Zoom in"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </>
      )}

      {analysisResult && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-4">
          <ImageAnalysis image={analysisResult} mode={selectedMode} />
        </div>
      )}
    </div>
  );
};

export default GoogleLens; 