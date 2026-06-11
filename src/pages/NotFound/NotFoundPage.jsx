import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants.js';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 24,
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: 48 }}>404</h1>
      <p style={{ color: 'var(--c-text-soft)' }}>The page you’re looking for doesn’t exist.</p>
      <Link to={ROUTES.DASHBOARD} className="btn bdk">Back to Dashboard</Link>
    </div>
  );
}
