import { getInitials } from '../../utils/formatters';
import './Avatar.css';

export function Avatar({ name, size = 'md', className = '' }) {
  return (
    <span className={`avatar avatar--${size} ${className}`} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
