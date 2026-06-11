import Card from '../../components/Card/Card.jsx';
import './upcoming-cards.css';

export default function UpcomingHolidaysCard({ holidays }) {
  return (
    <Card title="🎌 Upcoming Holidays" bodyPadding={false}>
      {holidays.slice(0, 6).map((h) => (
        <div key={`${h.dm}-${h.name}`} className="up-row">
          <div className="up-date">
            <div className="up-dm">{h.dm}</div>
            <div className="up-mo">{h.mo}</div>
          </div>
          <div className="up-flex">
            <div className="up-name">{h.name}</div>
          </div>
          <span
            className="up-pill"
            style={{ background: `${h.col}20`, color: h.col, borderColor: `${h.col}40` }}
          >
            {h.tag}
          </span>
        </div>
      ))}
    </Card>
  );
}
