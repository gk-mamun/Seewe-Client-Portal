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
  const { logout, isCompanyComplete } = useAuth();
  const navigate = useNavigate();

  const [badges, setBadges] = useState({ 'pending-leave': 0, 'pending-claim': 0 });

  useEffect(() => {
    if (!isCompanyComplete) return;        // skip badge fetches while locked
    Promise.all([leaveService.pendingCount(), claimsService.pendingCount()]).then(
      ([leave, claim]) => setBadges({ 'pending-leave': leave, 'pending-claim': claim })
    );
  }, [isCompanyComplete]);

  // Live-update the badges when a leave/claim is approved/rejected elsewhere.
  useEffect(() => leaveService.subscribePending(
    (n) => setBadges((b) => ({ ...b, 'pending-leave': n }))
  ), []);
  useEffect(() => claimsService.subscribePending(
    (n) => setBadges((b) => ({ ...b, 'pending-claim': n }))
  ), []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  // When the profile is incomplete, only the Company link is reachable.
  const items = isCompanyComplete
    ? SIDEBAR_ITEMS
    : SIDEBAR_ITEMS.filter((it) => it.to === ROUTES.COMPANY);

  return (
    <nav className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
      <div className="sb-logo">
        SeeWe<span>Work</span>
      </div>
      <div className="sb-section">Main Menu</div>

      {items.map((item) => (
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
        {isCompanyComplete ? (
          <>
            <div className="sb-wizard-title">✓ Setup Complete</div>
            <div className="sb-wizard-sub">Company profile configured</div>
          </>
        ) : (
          <>
            <div className="sb-wizard-title">⚠ Complete Your Profile</div>
            <div className="sb-wizard-sub">Fill required fields to unlock the portal</div>
          </>
        )}
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
