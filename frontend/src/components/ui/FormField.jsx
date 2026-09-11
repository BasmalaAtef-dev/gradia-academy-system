import { useId } from 'react';
import './Input.css';

export function FormField({ label, hint, error, required, children, htmlFor }) {
  const generatedId = useId();
  const fieldId = htmlFor || generatedId;

  return (
    <div className="field">
      {label && (
        <label htmlFor={fieldId} className={`field__label ${required ? 'field__label--required' : ''}`}>
          {label}
        </label>
      )}
      {typeof children === 'function'
        ? children({ id: fieldId, 'aria-describedby': error ? `${fieldId}-error` : undefined })
        : children}
      {error ? (
        <span id={`${fieldId}-error`} className="field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
