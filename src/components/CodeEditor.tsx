import Editor from '@monaco-editor/react';
import { Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Code2 size={20} className="text-gray-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-800" id="code-editor-heading">
            Code Editor
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={16} aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="h-96" role="region" aria-labelledby="code-editor-heading">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
