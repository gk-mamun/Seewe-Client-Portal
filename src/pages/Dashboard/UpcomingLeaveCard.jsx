import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import { ROUTES } from '../../utils/constants.js';
import './upcoming-cards.css';

export default function UpcomingLeaveCard({ items }) {
  return (
    <Card
      title="📅 Upcoming Leave"
      actions={<Link to={ROUTES.LEAVE} className="btn bol" style={{ fontSize: 11 }}>All</Link>}
      bodyPadding={false}
    >
      {items.length === 0 ? (
        <div className="appr-empty">No upcoming approved leave</div>
      ) : (
        items.slice(0, 5).map((a) => (
          <div key={a.id} className="up-row">
            <Avatar initials={a.initials} color={a.color} size={30} />
            <div className="up-flex">
              <div className="up-name">{a.name}</div>
              <div className="up-meta">
                {a.type} · {a.from}{a.from !== a.to && ` → ${a.to}`}
              </div>
            </div>
            <span className="up-days">{a.days}d</span>
          </div>
        ))
      )}
    </Card>
  );
}
