import './Timeline.css';

/** Activity timeline used on the dashboard. */
export function TimelineItem({ tone = 'blk', icon, title, meta, isLast = false }) {
  return (
    <div className="tl-item">
      <div className="tl-icon-wrap">
        <div className={`tl-icon ${tone}`}>{icon}</div>
        {!isLast && <div className="tl-line" />}
      </div>
      <div className="tl-body">
        <div className="tl-title">{title}</div>
        <div className="tl-meta">{meta}</div>
      </div>
    </div>
  );
}

export default function Timeline({ items = [] }) {
  return (
    <div className="timeline">
      {items.map((it, i) => (
        <TimelineItem key={it.id ?? i} {...it} isLast={i === items.length - 1} />
      ))}
    </div>
  );
}
