/**
 * Page header shown on every screen.
 *   • Left  — page title
 *   • Right — optional `actions` (Edit button, breadcrumbs, etc.)
 *
 * The current-user info widget was intentionally removed; pages that need
 * user context can pull it from `useAuth()` directly.
 */
export default function PageHeader({ title, actions = null }) {
  return (
    <header className="page-hd">
      <h1>{title}</h1>
      {actions && <div className="page-hd-actions">{actions}</div>}
    </header>
  );
}
