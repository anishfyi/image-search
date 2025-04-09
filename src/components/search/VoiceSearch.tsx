import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from '../common/icons';

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        onError?.(event.error);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, onError]);

  const toggleListening = () => {
    if (!isSupported) {
      onError?.('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        onError?.('Error starting voice recognition');
      }
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
        isListening
          ? 'bg-red-100 text-red-600'
          : 'hover:bg-neutral-hover text-neutral-secondary'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      title={isListening ? 'Stop listening' : 'Start voice search'}
    >
      <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
    </button>
  );
};

export default VoiceSearch; 