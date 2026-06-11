import { useSidebar } from '../../context/SidebarContext.jsx';
import './MobileTopbar.css';

export default function MobileTopbar() {
  const { toggle } = useSidebar();
  return (
    <div className="mob-topbar">
      <div className="mob-logo">SeeWe<span>Work</span></div>
      <button
        type="button"
        className="hamburger"
        onClick={toggle}
        aria-label="Open menu"
      >
        ☰
      </button>
    </div>
  );
}
