import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16 text-navy-500/70"
    >
      <Loader2 size={32} className="animate-spin text-ochre-500" />
      <p className="text-body2">{label}</p>
    </div>
  );
}