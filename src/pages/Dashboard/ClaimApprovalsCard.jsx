import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import { CLAIM_TYPE_ICONS } from '../../data/claims.js';
import { ROUTES } from '../../utils/constants.js';
import './approval-card.css';

export default function ClaimApprovalsCard({ items, max = 4 }) {
  const visible = items.slice(0, max);
  const extra = items.length - visible.length;

  return (
    <Card
      title={<>💰 Claim Approvals <span className="count-badge">{items.length}</span></>}
      actions={<Link to={ROUTES.CLAIMS} className="btn bol" style={{ fontSize: 11 }}>View All</Link>}
      bodyPadding={false}
    >
      {items.length === 0 ? (
        <div className="appr-empty">✓ No pending claim requests</div>
      ) : (
        <>
          {visible.map((c) => {
            const icon = CLAIM_TYPE_ICONS[c.type] || '💰';
            return (
              <div key={c.id} className="appr-row">
                <Avatar initials={c.initials} color={c.color} size={36} />
                <div className="appr-info">
                  <div className="appr-title">
                    {c.name}{' '}
                    <span style={{ color: 'var(--c-text-soft)', fontWeight: 400 }}>
                      — {icon} {c.type}
                    </span>
                  </div>
                  <div className="appr-meta">
                    <strong>{c.currency} {c.amount.toLocaleString()}</strong>
                    {' · '}
                    {c.date}
                  </div>
                  <div className="appr-quote">&ldquo;{c.desc}&rdquo;</div>
                </div>
              </div>
            );
          })}
          {extra > 0 && (
            <Link to={ROUTES.CLAIMS} className="appr-more">
              +{extra} more — View All
            </Link>
          )}
        </>
      )}
    </Card>
  );
}
