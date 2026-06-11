import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import MobileTopbar from '../components/MobileTopbar/MobileTopbar.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import './ClientLayout.css';

/**
 * Top-level shell shared by every authenticated page:
 *   ┌──────────────┐  Sidebar (fixed left)
 *   │ MobileTopbar │  ───── shown only on ≤ 768px
 *   │   <Outlet/>  │  page-specific content
 *   └──────────────┘
 */
export default function ClientLayout() {
  const { open, close } = useSidebar();

  return (
    <div className="app-layout">
      <MobileTopbar />
      <div
        className={`mob-overlay ${open ? 'show' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
