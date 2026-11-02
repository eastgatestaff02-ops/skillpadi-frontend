import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-navy-50 px-4 py-2 text-center text-body2 text-navy-500"
    >
      <WifiOff size={16} className="shrink-0" />
      You are offline. Some things may not load or save until your connection returns.
    </div>
  );
}