import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AppLayout.css';

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="app-layout">
      <div className="app-bg" aria-hidden="true">
        <span className="app-bg__blob app-bg__blob--1" />
        <span className="app-bg__blob app-bg__blob--2" />
        <span className="app-bg__blob app-bg__blob--3" />
        <span className="app-bg__blob app-bg__blob--4" />
      </div>

      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <div className="app-layout__body">
        <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}