import { forwardRef } from 'react';
import './Input.css';

export const Select = forwardRef(function Select({ error, className = '', children, ...rest }, ref) {
  const classes = ['input', 'select', error ? 'input--error' : '', className].filter(Boolean).join(' ');
  return (
    <select ref={ref} className={classes} aria-invalid={Boolean(error)} {...rest}>
      {children}
    </select>
  );
});
