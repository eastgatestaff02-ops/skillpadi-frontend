import { forwardRef, useId } from 'react';

const TextAreaField = forwardRef(function TextAreaField(
  { label, labelRight, helper, error, id, rows = 4, className = '', ...textareaProps },
  ref
) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const message = error || helper;
  const messageId = message ? `${fieldId}-message` : undefined;

  return (
    <div className={className}>
      {(label || labelRight) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <label
              htmlFor={fieldId}
              className={`text-caption font-bold ${error ? 'text-danger-500' : 'text-navy-500'}`}
            >
              {label}
            </label>
          )}
          {labelRight && <span className="text-caption text-navy-500/60">{labelRight}</span>}
        </div>
      )}

      <div
        className={`rounded-lg px-3 py-2.5 transition-colors focus-within:ring-2 ${
          error
            ? 'bg-white ring-1 ring-danger-500 focus-within:ring-danger-500'
            : 'bg-cream focus-within:ring-ochre-500'
        }`}
      >
        <textarea
          id={fieldId}
          ref={ref}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className="block w-full resize-none bg-transparent text-body1 text-navy-500 outline-none placeholder:text-navy-500/40"
          {...textareaProps}
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

export default TextAreaField;