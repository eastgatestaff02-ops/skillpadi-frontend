import { useId } from 'react';
import Logo from '@/components/ui/Logo';

export default function AuthScreen({ title, subtitle, withLogo = false, centered = false, children }) {
  return (
    <div
      className={`flex min-h-screen justify-center bg-cream px-4 py-8 ${
        centered ? 'items-center' : 'items-start pt-12'
      }`}
    >
      <div className="w-full max-w-md">
        {withLogo ? (
          <div className="mb-6 flex items-center">
            <Logo size="sm" />
            <h1 className="flex-1 pr-12 text-center text-h3 font-bold text-navy-500">{title}</h1>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <h1 className="text-h2 font-bold text-navy-500">{title}</h1>
            {subtitle && <p className="mt-2 text-body2 text-navy-500/70">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function AuthCard({ className = '', children }) {
  return <div className={`rounded-3xl bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export function AuthField({
  label,
  icon: Icon,
  error,
  outlined = false,
  className = '',
  inputClassName = '',
  id,
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-body2 font-bold text-navy-500">
          {label}
        </label>
      )}
      <div
        className={`flex h-12 items-center gap-3 rounded-xl px-4 focus-within:ring-2 focus-within:ring-ochre-500 ${
          outlined ? 'border border-navy-100 bg-white' : 'bg-cream'
        } ${error ? 'ring-1 ring-danger-500' : ''}`}
      >
        {Icon && <Icon size={20} className="shrink-0 text-navy-500" />}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={`min-w-0 flex-1 bg-transparent text-body1 text-navy-500 outline-none placeholder:text-navy-500/40 ${inputClassName}`}
          {...inputProps}
        />
      </div>
      {error && <p className="mt-1.5 text-caption text-danger-500">{error}</p>}
    </div>
  );
}

export function AuthButton({ className = '', children, ...props }) {
  return (
    <button
      className={`h-12 w-full rounded-lg bg-ochre-500 text-body1 font-medium text-navy-500 transition-colors hover:bg-ochre-600 active:bg-ochre-700 disabled:cursor-not-allowed disabled:bg-ochre-200 disabled:text-ochre-500/70 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}