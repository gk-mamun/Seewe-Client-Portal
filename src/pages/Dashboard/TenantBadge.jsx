import Avatar from '../../components/Avatar/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './TenantBadge.css';

/** Top-right brand pill on the dashboard: company name + circular initials.
 *  Reads the signed-in client's company name from AuthContext. */
export default function TenantBadge() {
  const { user } = useAuth();
  const name = user?.name || 'Company';
  const initials = user?.initials || '—';

  return (
    <div className="tenant-badge">
      <span className="tenant-name">{name}</span>
      <Avatar initials={initials} size={32} />
    </div>
  );
}
