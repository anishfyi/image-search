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
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setError('Voice recognition error. Please try again.');
        console.error('Speech recognition error:', event.error);
      };
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
        onResult(transcript);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-google p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-neutral-900">Voice Search</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
            aria-label="Close voice search"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-neutral-100 hover:bg-neutral-200'
                } transition-colors`}
              >
                <MicrophoneIcon className="w-12 h-12 text-white" />
              </div>
              {isListening && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-white rounded-full animate-bounce"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full mb-4">
              <div className="bg-neutral-50 rounded-lg p-3 min-h-[60px]">
                <p className="text-neutral-900">
                  {transcript || (isListening ? 'Listening...' : 'Click the microphone to start')}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-6 py-2 rounded-full ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
              >
                {isListening ? 'Stop' : 'Start'}
              </button>
              {transcript && (
                <button
                  onClick={() => {
                    onResult(transcript);
                    onClose();
                  }}
                  className="px-6 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSearch; 