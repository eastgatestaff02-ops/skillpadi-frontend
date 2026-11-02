import { AlertCircle, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import Button from '@/components/ui/Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  const isOnline = useOnlineStatus();
  const Icon = isOnline ? AlertCircle : WifiOff;
  const text = isOnline ? message : 'You are offline. Check your connection and try again.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-danger-200 bg-danger-50 px-6 py-10 text-center"
    >
      <Icon size={32} className="text-danger-500" />
      <p className="max-w-sm text-body2 text-navy-500">{text}</p>
      {onRetry && (
        <Button tone="error" variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}