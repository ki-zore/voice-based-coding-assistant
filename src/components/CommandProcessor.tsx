import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface CommandProcessorProps {
  transcript: string;
  onProcess: () => void;
  isProcessing: boolean;
}

export function CommandProcessor({ transcript, onProcess, isProcessing }: CommandProcessorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <button
        onClick={onProcess}
        disabled={!transcript.trim() || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        aria-label="Process voice command"
        aria-busy={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Send size={20} aria-hidden="true" />
            <span>Process Command</span>
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Click to analyze your voice command and generate code
      </p>
    </div>
  );
}
