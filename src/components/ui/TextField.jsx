import { forwardRef, useId } from 'react';

const TextField = forwardRef(function TextField(
  {
    label,
    labelRight,
    icon: Icon,
    helper,
    error,
    id,
    className = '',
    inputClassName = '',
    ...inputProps
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const message = error || helper;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <div className={className}>
      {(label || labelRight) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className={`text-caption font-bold ${error ? 'text-danger-500' : 'text-navy-500'}`}
            >
              {label}
            </label>
          )}
          {labelRight && <span className="text-caption text-navy-500/60">{labelRight}</span>}
        </div>
      )}

      <div
        className={`flex h-11 items-center gap-2 rounded-lg px-3 transition-colors focus-within:ring-2 ${
          error
            ? 'bg-white ring-1 ring-danger-500 focus-within:ring-danger-500'
            : 'bg-cream focus-within:ring-ochre-500'
        }`}
      >
        {Icon && <Icon size={18} className={error ? 'text-danger-500' : 'text-navy-500'} />}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={`min-w-0 flex-1 bg-transparent text-body1 text-navy-500 outline-none placeholder:text-navy-500/40 ${inputClassName}`}
          {...inputProps}
        />
      </div>

      {message && (
        <p
          id={messageId}
          className={`mt-1.5 text-caption ${error ? 'text-danger-500' : 'text-navy-500/70'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
});

export default TextField;