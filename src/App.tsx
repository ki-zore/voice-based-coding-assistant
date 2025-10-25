import { useState, useCallback, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { VoiceInput } from './components/VoiceInput';
import { TranscriptBox } from './components/TranscriptBox';
import { CommandProcessor } from './components/CommandProcessor';
import { CodeEditor } from './components/CodeEditor';
import { ExplanationPanel } from './components/ExplanationPanel';
import { SessionTracker } from './components/SessionTracker';
import { supabase } from './lib/supabase';
import { processVoiceCommand } from './lib/gemini';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState('');
  const [intent, setIntent] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [commandCount, setCommandCount] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<'active' | 'paused' | 'completed'>('active');

  useEffect(() => {
    createSession();
  }, []);

  const createSession = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        title: `VOCO Session ${new Date().toLocaleString()}`,
        status: 'active'
      })
      .select()
      .maybeSingle();

    if (data && !error) {
      setSessionId(data.id);
    }
  };

  const handleToggleListening = useCallback(() => {
    setIsListening((prev) => !prev);
  }, []);

  const handleTranscriptChange = useCallback((newTranscript: string) => {
    setTranscript(newTranscript);
  }, []);

  const handleTranscriptEdit = useCallback((value: string) => {
    setTranscript(value);
  }, []);

  const handleProcess = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const result = await processVoiceCommand(transcript);

      setIntent(result.intent || '');
      setCode(result.code || '');
      setLanguage(result.language || 'javascript');
      setExplanation(result.explanation || '');

      if (sessionId) {
        await supabase.from('commands').insert({
          session_id: sessionId,
          transcript,
          intent: result.intent,
          code_generated: result.code,
          explanation: result.explanation,
          language: result.language,
        });

        setCommandCount((prev) => prev + 1);

        await supabase
          .from('sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', sessionId);
      }

      setTranscript('');
    } catch (error) {
      console.error('Processing error:', error);
      setExplanation('An error occurred while processing your command. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" role="application">
      <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Code2 size={32} className="text-blue-600" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VOCO</h1>
              <p className="text-sm text-gray-600">Voice-Based Coding Assistant</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6" role="main">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section aria-label="Voice input controls">
              <VoiceInput
                onTranscriptChange={handleTranscriptChange}
                isListening={isListening}
                onToggleListening={handleToggleListening}
              />
            </section>

            <section aria-label="Transcript editor">
              <TranscriptBox
                transcript={transcript}
                onTranscriptEdit={handleTranscriptEdit}
                isListening={isListening}
              />
            </section>

            <section aria-label="Command processing">
              <CommandProcessor
                transcript={transcript}
                onProcess={handleProcess}
                isProcessing={isProcessing}
              />
            </section>

            <section aria-label="Code editor">
              <CodeEditor code={code} language={language} onChange={setCode} />
            </section>
          </div>

          <div className="space-y-6">
            <section aria-label="Session information">
              <SessionTracker
                sessionId={sessionId}
                commandCount={commandCount}
                status={sessionStatus}
              />
            </section>

            <section aria-label="Code explanation">
              <ExplanationPanel explanation={explanation} intent={intent} />
            </section>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500" role="contentinfo">
          <p>Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + Space</kbd> to toggle microphone</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
