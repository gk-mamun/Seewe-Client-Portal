import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import { ROUTES } from '../../utils/constants.js';
import './approval-card.css';

export default function LeaveApprovalsCard({ items, max = 3 }) {
  const visible = items.slice(0, max);
  const extra = items.length - visible.length;

  return (
    <Card
      title={<>📅 Leave Approvals <span className="count-badge">{items.length}</span></>}
      actions={<Link to={ROUTES.LEAVE} className="btn bol" style={{ fontSize: 11 }}>View All</Link>}
      bodyPadding={false}
    >
      {items.length === 0 ? (
        <div className="appr-empty">✓ No pending leave requests</div>
      ) : (
        <>
          {visible.map((a) => (
            <div key={a.id} className="appr-row">
              <Avatar initials={a.initials} color={a.color} photo={a.photo} alt={a.name} size={36} />
              <div className="appr-info">
                <div className="appr-title">
                  {a.name} <span style={{ color: 'var(--c-text-soft)', fontWeight: 400 }}>— {a.type}</span>
                </div>
                <div className="appr-meta">
                  {a.from}
                  {a.from !== a.to && ` → ${a.to}`}
                  {' · '}
                  <strong>{a.days} day{a.days > 1 ? 's' : ''}</strong>
                </div>
                <div className="appr-quote">&ldquo;{a.reason}&rdquo;</div>
              </div>
            </div>
          ))}
          {extra > 0 && (
            <Link to={ROUTES.LEAVE} className="appr-more">
              +{extra} more — View All
            </Link>
          )}
        </>
      )}
    </Card>
  );
}
