import { FileText } from 'lucide-react';

interface TranscriptBoxProps {
  transcript: string;
  onTranscriptEdit: (value: string) => void;
  isListening: boolean;
}

export function TranscriptBox({ transcript, onTranscriptEdit, isListening }: TranscriptBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={20} className="text-gray-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-800" id="transcript-heading">
          Voice Transcript
        </h2>
      </div>
      <textarea
        value={transcript}
        onChange={(e) => onTranscriptEdit(e.target.value)}
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
        placeholder="Your voice input will appear here. You can edit it before processing..."
        disabled={isListening}
        aria-labelledby="transcript-heading"
        aria-live="polite"
        aria-atomic="true"
      />
      {isListening && (
        <p className="text-sm text-blue-600 mt-2" role="status" aria-live="polite">
          Listening... Speak your command
        </p>
      )}
    </div>
  );
}
