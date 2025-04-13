import React, { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { camera, flash, flashOff, close } from 'ionicons/icons';

interface GoogleLensCameraProps {
  onClose: () => void;
  onImageCapture: (image: string) => void;
}

const GoogleLensCamera: React.FC<GoogleLensCameraProps> = ({ onClose, onImageCapture }) => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraReady(true);
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initializeCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onImageCapture(imageData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Camera Preview */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
        />
        
        {/* Camera Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[280px] h-[280px] border-2 border-white rounded-lg" />
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"
          >
            <IonIcon icon={close} className="text-white text-2xl" />
          </button>
          <button
            onClick={() => setIsFlashOn(!isFlashOn)}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"
          >
            <IonIcon icon={isFlashOn ? flash : flashOff} className="text-white text-2xl" />
          </button>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCapture}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
            >
              <IonIcon icon={camera} className="text-black text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLensCamera; 