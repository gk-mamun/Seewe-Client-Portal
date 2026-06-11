import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

/** Centered card layout used by login + password setup screens. */
export default function AuthLayout() {
  return (
    <div className="auth-wrap">
      <Outlet />
    </div>
  );
}
