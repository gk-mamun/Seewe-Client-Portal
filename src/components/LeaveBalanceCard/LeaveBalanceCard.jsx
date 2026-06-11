import './LeaveBalanceCard.css';

export default function LeaveBalanceCard({ type, used, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <article className="leave-card">
      <div className="l-type">{type}</div>
      <div className="l-used">
        {used}
        <span className="l-total"> / {total}</span>
      </div>
      <div className="l-bar"><div className="l-fill" style={{ width: `${pct}%` }} /></div>
    </article>
  );
}

export function LeaveBalanceGrid({ children }) {
  return <div className="leave-grid">{children}</div>;
}
