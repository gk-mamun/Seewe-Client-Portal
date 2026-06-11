import { formatHKD } from '../../utils/format.js';
import './SalaryBreakdown.css';

/**
 * Renders the 5-up salary breakdown tiles used on the employee profile.
 * `items` is an array of {label, value, isTotal?}.
 */
export default function SalaryBreakdown({ items }) {
  return (
    <div className="salary-breakdown">
      {items.map((it) => (
        <div key={it.label} className={`sal-item ${it.isTotal ? 'total' : ''}`}>
          <div className="s-lbl">{it.label}</div>
          <div className="s-val">{formatHKD(it.value)}</div>
        </div>
      ))}
    </div>
  );
}
