import './HolidayCard.css';

const THEME_TAG = { hk: 'tag-hk', my: 'tag-my', eoff: 'tag-eoff' };

export default function HolidayCard({ dm, mo, name, loc, tag, theme = 'my' }) {
  return (
    <article className={`hol-card ${theme}`}>
      <div className="hol-date">
        <div className="dm">{dm}</div>
        <div className="mo">{mo}</div>
      </div>
      <div className="hol-info">
        <div className="name">{name}</div>
        <div className="loc">{loc}</div>
      </div>
      <span className={`hol-tag ${THEME_TAG[theme] || ''}`}>{tag}</span>
    </article>
  );
}

export function HolidayGrid({ children }) {
  return <div className="hol-grid">{children}</div>;
}
