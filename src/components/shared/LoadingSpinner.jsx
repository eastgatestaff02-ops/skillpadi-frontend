import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500"
    >
      <Loader2 size={32} className="animate-spin text-teal-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}