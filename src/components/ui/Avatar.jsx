import { User } from 'lucide-react';

const sizes = {
  sm: 'h-9 w-9 text-caption',
  md: 'h-11 w-11 text-body2',
  lg: 'h-16 w-16 text-h3',
};

const iconSizes = { sm: 16, md: 20, lg: 28 };

const getInitials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-ochre-100 font-bold text-navy-500 ${sizes[size]} ${className}`}
    >
      {initials || <User size={iconSizes[size]} />}
    </span>
  );
}