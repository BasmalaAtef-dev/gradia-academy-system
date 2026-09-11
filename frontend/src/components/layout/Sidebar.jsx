import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { NAV_BY_ROLE, SETTINGS_NAV } from './navConfig';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose }) {
  const { session, role } = useAuth();
  const items = NAV_BY_ROLE[role] || [];

  function linkClass({ isActive }) {
    return `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`;
  }

  return (
    <div className="sidebar-rail">
      {isOpen && (
        <div
          className="sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <nav className="sidebar__nav" aria-label="Main navigation">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={onClose}
              end={item.to === '/dashboard'}
            >
              <span className="sidebar__link-icon" aria-hidden="true">
                <item.icon />
              </span>

              <span className="sidebar__link-text">
                {item.label}
              </span>
            </NavLink>
          ))}

          <div className="sidebar__divider" aria-hidden="true" />

          <NavLink
            to={SETTINGS_NAV.to}
            className={linkClass}
            onClick={onClose}
          >
            <span className="sidebar__link-icon" aria-hidden="true">
              <SETTINGS_NAV.icon />
            </span>

            <span className="sidebar__link-text">
              {SETTINGS_NAV.label}
            </span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <NavLink
            to="/profile"
            className="sidebar__profile-link"
            onClick={onClose}
            aria-label={`Open profile for ${session?.fullName || 'user'}`}
          >
            <div className="sidebar__user">
              <Avatar
                name={session?.fullName}
                size="sm"
              />

              <div className="sidebar__user-info">
                <div className="sidebar__user-name">
                  {session?.fullName}
                </div>

                <div className="sidebar__user-role">
                  {session?.role}
                </div>
              </div>
            </div>
          </NavLink>
        </div>
      </aside>
    </div>
  );
}

