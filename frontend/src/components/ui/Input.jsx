import { forwardRef, useState } from 'react';
import './Input.css';

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {open ? (
      <>
        <path
          d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </>
    ) : (
      <>
        <path
          d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M6.6 6.7C4 8.3 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.4-1.1M17.5 6.4C16 5 14.2 4.2 12 4.2c-.7 0-1.4.1-2 .2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

export const Input = forwardRef(function Input(
  { error, iconLeft, type = 'text', className = '', ...rest },
  ref
) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && revealed ? 'text' : type;

  const classes = [
    'input',
    error ? 'input--error' : '',
    iconLeft ? 'input--with-icon-left' : '',
    isPassword ? 'input--with-icon-right' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input-wrap">
      {iconLeft && (
        <span className="input-icon input-icon--left" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <input ref={ref} type={effectiveType} className={classes} aria-invalid={Boolean(error)} {...rest} />
      {isPassword && (
        <button
          type="button"
          className="input-icon input-icon--right input-icon--button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          <EyeIcon open={revealed} />
        </button>
      )}
    </div>
  );
});
