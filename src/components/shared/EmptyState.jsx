import { Inbox } from 'lucide-react';

export default function EmptyState({ title, message, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-navy-50 bg-white px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ochre-50">
        <Icon size={28} className="text-ochre-500" />
      </span>
      <h3 className="text-h3 font-bold text-navy-500">{title}</h3>
      {message && <p className="max-w-sm text-body2 text-navy-500/70">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}