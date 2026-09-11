import './Panel.css';

export function Panel({ title, subtitle, actions, children, flushBody = false }) {
  return (
    <div className="panel">
      {(title || actions) && (
        <div className="panel__header">
          <div>
            {title && <div className="panel__title">{title}</div>}
            {subtitle && <div className="panel__subtitle">{subtitle}</div>}
          </div>
          {actions}
        </div>
      )}
      <div className={`panel__body ${flushBody ? 'panel__body--flush' : ''}`}>{children}</div>
    </div>
  );
}
