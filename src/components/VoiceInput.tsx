import { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

export function VoiceInput({ onTranscriptChange, isListening, onToggleListening }: VoiceInputProps) {
  const {
    isListening: recognitionIsListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  useEffect(() => {
    if (isListening && !recognitionIsListening) {
      startListening();
    } else if (!isListening && recognitionIsListening) {
      stopListening();
    }
  }, [isListening, recognitionIsListening, startListening, stopListening]);

  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        onToggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggleListening]);

  if (!isSupported) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        role="alert"
        aria-live="polite"
      >
        <p className="text-red-800 text-sm">
          Speech recognition is not supported in your browser. Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={onToggleListening}
      className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium text-lg transition-all ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 animate-pulse'
          : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
      aria-pressed={isListening}
      role="button"
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      <span>{isListening ? 'Stop Listening' : 'Start Listening (Ctrl + Space)'}</span>
    </button>
  );
}
