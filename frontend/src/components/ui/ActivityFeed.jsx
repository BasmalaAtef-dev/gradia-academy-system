import { formatRelativeTime } from '../../utils/formatters';
import { IconClipboard, IconUsers, IconBook, IconChalkboard } from './icons';
import './ActivityFeed.css';

const ICONS = {
  grade: IconClipboard,
  enrollment: IconUsers,
  course: IconBook,
  student: IconUsers,
  teacher: IconChalkboard,
};

export function ActivityFeed({ items }) {
  if (!items || items.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', padding: 'var(--space-5)' }}>No recent activity.</p>;
  }

  return (
    <div className="activity-list">
      {items.map((item) => {
        const Icon = ICONS[item.type] || IconClipboard;
        return (
         <div key={`${item.type}-${item.id}`} className="activity-item">
            <span className="activity-item__icon" aria-hidden="true">
              <Icon />
            </span>
            <div className="activity-item__body">
              <div className="activity-item__detail">
                <strong>{item.actor}</strong> {item.detail}
              </div>
              <div className="activity-item__meta">{formatRelativeTime(item.timestamp)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
