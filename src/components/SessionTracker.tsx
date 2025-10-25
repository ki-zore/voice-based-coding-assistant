import { Clock, Activity, FileCode } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SessionTrackerProps {
  sessionId: string | null;
  commandCount: number;
  status: 'active' | 'paused' | 'completed';
}

export function SessionTracker({ sessionId, commandCount, status }: SessionTrackerProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (status === 'active') {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4" id="session-tracker-heading">
        Session Tracker
      </h2>

      <div className="space-y-3" role="region" aria-labelledby="session-tracker-heading">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-gray-600" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-600" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">Duration:</span>
          </div>
          <span className="text-sm font-mono text-gray-900" aria-live="polite">
            {formatDuration(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileCode size={18} className="text-gray-600" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">Commands:</span>
          </div>
          <span className="text-sm font-mono text-gray-900" aria-live="polite">
            {commandCount}
          </span>
        </div>

        {sessionId && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Session ID: <span className="font-mono">{sessionId.slice(0, 8)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
