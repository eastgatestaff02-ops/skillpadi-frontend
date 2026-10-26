import { AlertCircle, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  const isOnline = useOnlineStatus();
  const Icon = isOnline ? AlertCircle : WifiOff;
  const text = isOnline ? message : 'You are offline. Check your connection and try again.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <Icon size={32} className="text-red-500" />
      <p className="text-sm text-red-700">{text}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}