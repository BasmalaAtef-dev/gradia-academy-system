import { createPortal } from 'react-dom';
import { useToast } from '../../hooks/useToast';
import './Toast.css';

const icons = {
  success: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 3l6 6M9 3 3 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 5.2v3.3M6 3.5h.01" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

export function ToastStack() {
  const { toasts, dismiss } = useToast();

  return createPortal(
    <div className="toast-stack" aria-live="assertive" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.variant}`} onClick={() => dismiss(t.id)}>
          <span className="toast__icon" aria-hidden="true">
            {icons[t.variant]}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}
