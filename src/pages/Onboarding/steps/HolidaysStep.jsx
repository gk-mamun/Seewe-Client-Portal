import { HOLIDAYS } from '../../../data/holidays.js';

export default function HolidaysStep({ data, onChange }) {
  const selected = data.holidays || HOLIDAYS.map((_, i) => i);

  const toggle = (idx) => {
    const next = selected.includes(idx)
      ? selected.filter((i) => i !== idx)
      : [...selected, idx];
    onChange({ holidays: next });
  };

  return (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>Public Holidays</h2>
      <p style={{ fontSize: 13, color: 'var(--c-text-soft)', marginBottom: 28 }}>
        Confirm the holidays your employees will observe.
      </p>

      {HOLIDAYS.map((h, i) => (
        <label key={`${h.dm}-${h.name}`} className="hol-item">
          <input
            className="hol-chk"
            type="checkbox"
            checked={selected.includes(i)}
            onChange={() => toggle(i)}
          />
          <span>{h.dm} {h.mo} — {h.name} ({h.loc})</span>
        </label>
      ))}
    </>
  );
}
