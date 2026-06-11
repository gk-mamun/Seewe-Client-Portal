import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from './sidebarItems.js';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { leaveService } from '../../services/leaveService.js';
import { claimsService } from '../../services/claimsService.js';
import { ROUTES } from '../../utils/constants.js';
import './Sidebar.css';

export default function Sidebar() {
  const { open, close } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [badges, setBadges] = useState({ 'pending-leave': 0, 'pending-claim': 0 });

  useEffect(() => {
    Promise.all([leaveService.pendingCount(), claimsService.pendingCount()]).then(
      ([leave, claim]) => setBadges({ 'pending-leave': leave, 'pending-claim': claim })
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
      <div className="sb-logo">
        SeeWe<span>Work</span>
      </div>
      <div className="sb-section">Main Menu</div>

      {SIDEBAR_ITEMS.map((item) => (
        <NavLink
          key={item.key}
          to={item.to}
          onClick={close}
          className={({ isActive }) => `si ${isActive ? 'on' : ''}`}
        >
          <span className="ico" aria-hidden="true">{item.icon}</span>
          <span className="si-txt">{item.label}</span>
          {item.badge && badges[item.badge] > 0 && (
            <span className="nbadge">{badges[item.badge]}</span>
          )}
        </NavLink>
      ))}

      <div className="sb-wizard">
        <div className="sb-wizard-title">✓ Setup Complete</div>
        <div className="sb-wizard-sub">Company profile configured</div>
      </div>

      <div className="sb-footer">
        <button type="button" className="si" onClick={handleLogout}>
          <span className="ico" aria-hidden="true">🚪</span>
          <span className="si-txt">Log Out</span>
        </button>
      </div>
    </nav>
  );
}
