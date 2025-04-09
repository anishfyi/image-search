import React from 'react';

interface AudioListeningAnimationProps {
  isListening: boolean;
  className?: string;
}

const AudioListeningAnimation: React.FC<AudioListeningAnimationProps> = ({ 
  isListening,
  className = ''
}) => {
  return (
    <div 
      className={`flex items-center justify-center space-x-1 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={isListening ? "Listening..." : "Not listening"}
    >
      <div className="flex items-center space-x-1">
        <div 
          className={`w-1 h-4 bg-[#4285f4] rounded-full transition-all duration-300 ${
            isListening ? 'animate-audio-wave' : 'opacity-50'
          }`}
          style={{
            animationDelay: '0ms'
          }}
        />
        <div 
          className={`w-1 h-4 bg-[#4285f4] rounded-full transition-all duration-300 ${
            isListening ? 'animate-audio-wave' : 'opacity-50'
          }`}
          style={{
            animationDelay: '150ms'
          }}
        />
        <div 
          className={`w-1 h-4 bg-[#4285f4] rounded-full transition-all duration-300 ${
            isListening ? 'animate-audio-wave' : 'opacity-50'
          }`}
          style={{
            animationDelay: '300ms'
          }}
        />
        <div 
          className={`w-1 h-4 bg-[#4285f4] rounded-full transition-all duration-300 ${
            isListening ? 'animate-audio-wave' : 'opacity-50'
          }`}
          style={{
            animationDelay: '450ms'
          }}
        />
      </div>
      <span className="text-sm text-[#4285f4] ml-2">
        {isListening ? 'Listening...' : 'Tap to speak'}
      </span>
    </div>
  );
};

export default AudioListeningAnimation; 