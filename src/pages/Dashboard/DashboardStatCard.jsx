import './DashboardStatCard.css';

/**
 * Dashboard-specific stat tile: icon row, uppercase label, large coloured
 * number, and a sub-line. Different from the generic <StatCard> used on
 * other pages so it can render the icon + brand-coloured value.
 */
export default function DashboardStatCard({ icon, label, value, valueColor, sub, subColor }) {
  return (
    <article className="dash-stat">
      <div className="dash-stat-icon" aria-hidden="true">{icon}</div>
      <div className="dash-stat-lbl">{label}</div>
      <div className="dash-stat-val" style={{ color: valueColor }}>{value}</div>
      {sub && <div className="dash-stat-sub" style={{ color: subColor }}>{sub}</div>}
    </article>
  );
}

export function DashboardStatGrid({ children }) {
  return <div className="dash-stat-grid">{children}</div>;
}
