import Avatar from '../../components/Avatar/Avatar.jsx';
import './TenantBadge.css';

/** Top-right brand pill on the dashboard: company name + circular initials. */
export default function TenantBadge({ name = 'Brighten Technology', initials = 'BT' }) {
  return (
    <div className="tenant-badge">
      <span className="tenant-name">{name}</span>
      <Avatar initials={initials} size={32} />
    </div>
  );
}
