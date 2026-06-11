import { CHARGE_COLORS } from '../../data/deptLeads.js';
import './ChargeChip.css';

/**
 * Selectable responsibility chip. When `selected`, paints with the charge's
 * theme colors; when not, shows the "available" green state.
 */
export default function ChargeChip({ charge, selected, onToggle, readOnly = false }) {
  const theme = CHARGE_COLORS[charge] || { color: '#888', bg: '#f9f9f9' };
  const style = selected
    ? { color: theme.color, background: theme.bg, borderColor: `${theme.color}33` }
    : { color: '#166534', background: '#f0fdf4', borderColor: '#bbf7d033' };

  if (readOnly) {
    return <span className="charge-chip" style={style}>{charge}</span>;
  }
  return (
    <label className="charge-chip charge-chip--toggle" style={style}>
      <input
        type="checkbox"
        checked={!!selected}
        onChange={() => onToggle?.(charge)}
        style={{ accentColor: style.color, width: 11, height: 11 }}
      />
      {charge}
    </label>
  );
}
