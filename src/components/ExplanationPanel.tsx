import { MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface ExplanationPanelProps {
  explanation: string;
  intent: string;
}

export function ExplanationPanel({ explanation, intent }: ExplanationPanelProps) {
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stop();
    } else {
      const textToSpeak = `Intent: ${intent}. Explanation: ${explanation}`;
      speak(textToSpeak);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-gray-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-800" id="explanation-heading">
            Explanation
          </h2>
        </div>
        <button
          onClick={handleToggleSpeech}
          disabled={!explanation}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-blue-800 rounded-md transition-colors"
          aria-label={isSpeaking ? 'Stop reading explanation' : 'Read explanation aloud'}
          aria-pressed={isSpeaking}
        >
          {isSpeaking ? (
            <>
              <VolumeX size={16} aria-hidden="true" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Volume2 size={16} aria-hidden="true" />
              <span>Listen</span>
            </>
          )}
        </button>
      </div>

      {intent && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg" role="region" aria-label="Command intent">
          <p className="text-sm font-medium text-blue-800">Intent:</p>
          <p className="text-sm text-blue-900 mt-1">{intent}</p>
        </div>
      )}

      <div
        className="prose prose-sm max-w-none"
        role="region"
        aria-labelledby="explanation-heading"
        aria-live="polite"
      >
        {explanation ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{explanation}</p>
        ) : (
          <p className="text-gray-400 italic">No explanation available yet. Process a command to see details.</p>
        )}
      </div>
    </div>
  );
}
