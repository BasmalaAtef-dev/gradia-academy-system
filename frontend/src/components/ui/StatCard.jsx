import './StatCard.css';

const TrendIcon = ({ direction }) => {
  if (direction === 'flat') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  const up = direction === 'up';
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ transform: up ? 'none' : 'rotate(180deg)' }}
    >
      <path
        d="M6 10V2M6 2L2.5 5.5M6 2l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export function StatCard({ label, value, icon, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <div>
          <div className="stat-card__label">{label}</div>
          <div className="stat-card__value">{value}</div>
        </div>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
      {trend && (
        <span className={`stat-card__trend stat-card__trend--${trend.direction}`}>
          <TrendIcon direction={trend.direction} />
          {trend.label}
        </span>
      )}
    </div>
  );
}
