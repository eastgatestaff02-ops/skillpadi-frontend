import { Check } from 'lucide-react';

export default function RoleCard({ icon: Icon, title, description, selected, onSelect, disabled }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-500 disabled:opacity-60 ${
        selected
          ? 'border-ochre-500 bg-ochre-50'
          : 'border-navy-50 bg-white hover:border-ochre-200'
      }`}
    >
      <Icon size={24} className="shrink-0 text-navy-500" />
      <span className="flex-1">
        <span className="block text-body1 font-bold text-navy-500">{title}</span>
        <span className="block text-body2 text-navy-500/70">{description}</span>
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected ? 'border-ochre-500 bg-ochre-200' : 'border-navy-100 bg-white'
        }`}
      >
        {selected && <Check size={14} className="text-navy-500" />}
      </span>
    </button>
  );
}