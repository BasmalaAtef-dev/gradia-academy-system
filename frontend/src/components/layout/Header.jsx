import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';
import { IconMenu, IconBell, IconChevronDown, IconLogout, IconUser } from '../ui/icons';
import { Link } from "react-router-dom";
import logoUrl from '../../assets/logo.png';
import './Header.css';

export function Header({ onMenuClick }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button className="app-header__menu-btn" onClick={onMenuClick} aria-label="Open navigation menu">
          <IconMenu />
        </button>
        <Link to="/dashboard" className="app-header__logo-link" aria-label="Go to home">
          <img src={logoUrl} alt="GRADIA" className="app-header__logo-img"/>
        </Link>      
        </div>

      <div className="app-header__right">
        <button className="app-header__icon-btn" aria-label="Notifications">
          <IconBell />
          <span className="app-header__icon-btn-dot" aria-hidden="true" />
        </button>

        <Dropdown
          trigger={
            <div className="app-header__user-trigger">
              <Avatar name={session?.fullName} size="sm" />
              <span className="app-header__user-name">{session?.fullName}</span>
              <IconChevronDown />
            </div>
          }
        >
          <DropdownItem onClick={() => navigate('/profile')}>
            <IconUser /> Profile & Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem danger onClick={handleLogout}>
            <IconLogout /> Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}