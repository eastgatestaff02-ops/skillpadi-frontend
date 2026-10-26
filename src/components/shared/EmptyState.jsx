import { Inbox } from 'lucide-react';

export default function EmptyState({ title, message, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <Icon size={36} className="text-gray-400" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {message && <p className="max-w-sm text-sm text-gray-500">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}