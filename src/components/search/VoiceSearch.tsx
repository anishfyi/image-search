import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, XMarkIcon } from '../common/icons';

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        setIsAnimating(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsAnimating(false);
      };

      recognitionRef.current.onresult = (event) => {
        const newTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setTranscript(newTranscript);

        // Reset silence timer whenever we get new speech
        if (newTranscript !== lastTranscriptRef.current) {
          lastTranscriptRef.current = newTranscript;
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Set new silence timer
          silenceTimeoutRef.current = setTimeout(() => {
            if (newTranscript) {
              submitAndClose(newTranscript);
            }
          }, 2000); // 2 seconds of silence
        }
      };

      recognitionRef.current.onerror = (event) => {
        setError('Voice recognition error. Please try again.');
        console.error('Speech recognition error:', event.error);
      };

      // Start listening immediately when component mounts
      startListening();
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const submitAndClose = (text: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onResult(text);
    onClose();
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Failed to start voice recognition. Please try again.');
        console.error('Start listening error:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      if (transcript) {
        submitAndClose(transcript);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#202124] z-50 flex flex-col items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
        aria-label="Close voice search"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
        {error ? (
          <div className="text-red-500 text-center mb-4 text-lg">{error}</div>
        ) : (
          <>
            {/* Transcript */}
            <div className="w-full text-center mb-16">
              <p className="text-[#bdc1c6] text-4xl font-light min-h-[48px]">
                {transcript || "Speak now"}
              </p>
            </div>

            {/* Microphone button */}
            <div className="relative">
              <button
                onClick={stopListening}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300
                  ${isListening ? 'bg-white' : 'bg-[#ea4335]'}`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                <MicrophoneIcon 
                  className={`w-16 h-16 transition-colors duration-300
                    ${isListening ? 'text-[#ea4335]' : 'text-white'}`} 
                />
              </button>

              {/* Ripple effect */}
              {isAnimating && (
                <div className="absolute inset-0 animate-ripple">
                  <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceSearch; 