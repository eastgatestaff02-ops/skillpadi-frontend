import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 32, disabled = false }) {
  return (
    <div role="radiogroup" aria-label="Rating" className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          className="flex flex-1 flex-col items-center gap-1 rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-500 disabled:opacity-60"
        >
          <Star
            size={size}
            className={star <= value ? 'fill-ochre-500 text-ochre-500' : 'text-navy-200'}
          />
          <span className="text-caption text-navy-500/70">{star}</span>
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ value = 0, size = 16, className = '' }) {
  const rounded = Math.round(value);

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rounded ? 'fill-ochre-500 text-ochre-500' : 'text-navy-200'}
        />
      ))}
    </span>
  );
}