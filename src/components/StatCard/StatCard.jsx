import './StatCard.css';

/** Single stat tile (e.g. "Active Employees · 4 · ↑ 1"). */
export default function StatCard({ label, value, change, changeType = 'neu' }) {
  return (
    <article className="stat-card">
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      {change && <div className={`chg ${changeType}`}>{change}</div>}
    </article>
  );
}

/** Container that lays a list of stat tiles into the responsive grid. */
export function StatGrid({ children }) {
  return <div className="stat-grid">{children}</div>;
}
