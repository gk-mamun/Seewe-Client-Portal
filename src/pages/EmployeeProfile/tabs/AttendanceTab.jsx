import { useEffect, useMemo, useState } from 'react';
import { employeeService } from '../../../services/employeeService.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Last `count` months (including current), newest first. */
function monthOptions(count = 12) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      month: dt.getMonth() + 1,
      year: dt.getFullYear(),
      value: `${dt.getFullYear()}-${dt.getMonth() + 1}`,
      label: `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`,
    };
  });
}

export default function AttendanceTab({ employee }) {
  const options = useMemo(() => monthOptions(12), []);
  const [value, setValue] = useState(options[0].value);
  const [pdf, setPdf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    if (!employee?.id) return undefined;
    let alive = true;
    setLoading(true);
    setError('');
    setPdf('');
    employeeService
      .generateAttendanceReport({ userId: employee.id, month: selected.month, year: selected.year })
      .then((url) => { if (alive) setPdf(url); })
      .catch((err) => { if (alive) setError(err?.message || 'Could not generate the attendance report.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [employee?.id, selected.month, selected.year]);

  return (
    <>
      <div className="section-hd">Attendance Report — {selected.label}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <select
          className="tiny-select"
          style={{ maxWidth: 170 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {pdf && (
          <a href={pdf} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)' }}>
            Open in new tab ↗
          </a>
        )}
      </div>

      {loading ? (
        <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Generating report…</p>
      ) : error ? (
        <p style={{ padding: 20, color: 'var(--c-danger)' }}>{error}</p>
      ) : pdf ? (
        <iframe
          title={`Attendance Report — ${selected.label}`}
          src={pdf}
          style={{ width: '100%', height: 700, border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)' }}
        />
      ) : (
        <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>No attendance report for this month.</p>
      )}
    </>
  );
}
