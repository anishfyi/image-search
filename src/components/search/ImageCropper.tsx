import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  };

  const generateCroppedImage = () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const croppedImage = canvas.toDataURL('image/jpeg');
    onCropComplete(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crop Image</h2>
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={generateCroppedImage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply Crop
            </button>
          </div>
        </div>
        <div className="relative">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop me"
              onLoad={onImageLoad}
              className="max-w-full"
            />
          </ReactCrop>
          <canvas
            ref={previewCanvasRef}
            className="hidden"
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop?.width,
              height: completedCrop?.height,
            }}
          />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Drag the corners or edges to adjust the crop area.</p>
          <p>Press and hold Shift to maintain aspect ratio.</p>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 