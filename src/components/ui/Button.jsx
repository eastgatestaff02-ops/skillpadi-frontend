import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-caption',
  md: 'h-10 gap-2 px-4 text-body2',
  lg: 'h-12 gap-2 px-6 text-body1',
};

const iconSizes = { sm: 16, md: 18, lg: 20 };

const styles = {
  action: {
    filled:
      'bg-ochre-500 text-navy-500 hover:bg-ochre-600 active:bg-ochre-700 disabled:bg-ochre-200 disabled:text-ochre-500/70',
    outlined:
      'border border-ochre-500 bg-white text-navy-500 hover:bg-ochre-50 active:bg-ochre-200 disabled:border-ochre-200 disabled:bg-ochre-50 disabled:text-navy-500/40',
    text: 'text-ochre-500 hover:bg-ochre-50 active:bg-ochre-100 disabled:text-ochre-200',
  },
  error: {
    filled:
      'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 disabled:bg-danger-200 disabled:text-white',
    outlined:
      'border border-danger-500 bg-white text-danger-500 hover:bg-danger-100 active:bg-danger-200 disabled:border-danger-200 disabled:bg-danger-50 disabled:text-danger-200',
    text: 'text-danger-500 hover:bg-danger-50 active:bg-danger-100 disabled:text-danger-200',
  },
};

export default function Button({
  variant = 'filled',
  tone = 'action',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  fullWidth = false,
  to,
  type = 'button',
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const iconSize = iconSizes[size];
  const classes = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-500',
    'disabled:cursor-not-allowed',
    sizes[size],
    styles[tone][variant],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        LeftIcon && <LeftIcon size={iconSize} />
      )}
      {children}
      {RightIcon && !loading && <RightIcon size={iconSize} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled || loading} className={classes} {...props}>
      {content}
    </button>
  );
}