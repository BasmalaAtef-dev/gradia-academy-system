import { Button } from './Button';
import './StateScreen.css';

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="state-screen" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="state-screen__desc">{label}</span>
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'When there is data to show, it will appear here.',
  icon,
  action,
}) {
  return (
    <div className="state-screen">
      <div className="state-screen__icon" aria-hidden="true">
        {icon || <DefaultEmptyIcon />}
      </div>
      <div className="state-screen__title">{title}</div>
      <p className="state-screen__desc">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this data. Please try again.',
  onRetry,
}) {
  return (
    <div className="state-screen state-screen--error">
      <div className="state-screen__icon" aria-hidden="true">
        <DefaultErrorIcon />
      </div>
      <div className="state-screen__title">{title}</div>
      <p className="state-screen__desc">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

function DefaultEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M4 7l1.5 12a2 2 0 0 0 2 1.8h9a2 2 0 0 0 2-1.8L20 7M9 11h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DefaultErrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4m0 4h.01M10.3 3.9 2.5 17.5A1.8 1.8 0 0 0 4 20.2h16a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
