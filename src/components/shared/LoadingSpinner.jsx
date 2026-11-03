import { Loader2 } from 'lucide-react';

function Bar({ className = '' }) {
  return <div className={`rounded bg-navy-50 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-navy-50 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-full bg-navy-50" />
        <div className="flex-1 space-y-2">
          <Bar className="h-3.5 w-2/3" />
          <Bar className="h-3 w-1/3" />
        </div>
      </div>
      <Bar className="mt-4 h-3 w-full" />
      <Bar className="mt-2 h-3 w-4/5" />
      <Bar className="mt-4 h-10 w-full rounded-lg" />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-navy-50 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full bg-navy-50" />
          <div className="flex-1 space-y-2.5">
            <Bar className="h-5 w-1/2" />
            <Bar className="h-3.5 w-1/3" />
            <Bar className="h-3.5 w-1/4" />
          </div>
        </div>
        <Bar className="mt-5 h-12 w-full rounded-lg" />
      </div>
      <CardSkeleton />
    </div>
  );
}

export default function LoadingSpinner({ label = 'Loading...', variant = 'spinner' }) {
  if (variant === 'spinner') {
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

  let shape;
  if (variant === 'profile') {
    shape = <ProfileSkeleton />;
  } else if (variant === 'list') {
    shape = (
      <div className="space-y-4">
        {[0, 1, 2].map((item) => (
          <CardSkeleton key={item} />
        ))}
      </div>
    );
  } else {
    shape = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <CardSkeleton key={item} />
        ))}
      </div>
    );
  }

  return (
    <div role="status" aria-busy="true" className="animate-pulse">
      {shape}
      <span className="sr-only">{label}</span>
    </div>
  );
}