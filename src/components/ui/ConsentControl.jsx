import { Check } from 'lucide-react';
import Button from './Button';

export default function ConsentControl({
  checked,
  onChange,
  onReadNotice,
  error,
  helper = 'You can withdraw consent in your privacy settings.',
  children,
}) {
  return (
    <div>
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
          checked
            ? 'border-ochre-500 bg-ochre-50'
            : error
              ? 'border-danger-500 bg-white'
              : 'border-navy-100 bg-white'
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-navy-500/60 bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy-500">
          {checked && <Check size={14} className="text-navy-500" />}
        </span>
        <span className="text-body2 text-navy-500">{children}</span>
      </label>

      <p className={`mt-2 text-caption ${error ? 'text-danger-500' : 'text-navy-500/70'}`}>
        {error || helper}
      </p>

      {onReadNotice && (
        <Button variant="outlined" fullWidth className="mt-2" onClick={onReadNotice}>
          Read privacy notice
        </Button>
      )}
    </div>
  );
}