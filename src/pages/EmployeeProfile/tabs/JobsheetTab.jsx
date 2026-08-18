import { useEffect, useState } from 'react';
import DataTable from '../../../components/DataTable/DataTable.jsx';
import { employeeService } from '../../../services/employeeService.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n) => String(n).padStart(2, '0');

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** "2026-05-14" → { label: "14 May 2026", weekday: "Wednesday" }. */
const describeDate = (iso) => {
  const [y, m, d] = String(iso || '').split('-').map(Number);
  if (!y || !m || !d) return { label: iso, weekday: '' };
  const dt = new Date(y, m - 1, d);
  return { label: `${d} ${MONTHS[m - 1]} ${y}`, weekday: DOW[dt.getDay()] };
};

/** Extract "HH:MM" from a datetime/time string. */
const hm = (v) => {
  const m = String(v ?? '').match(/(\d{1,2}):(\d{2})/);
  return m ? `${pad(m[1])}:${m[2]}` : '';
};

/** Epoch ms from "YYYY-MM-DD HH:MM[:SS]". */
const parseDT = (s) => {
  const m = String(s ?? '').match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return NaN;
  const [, Y, Mo, D, H, Mi, S] = m;
  return Date.UTC(+Y, +Mo - 1, +D, +H, +Mi, +(S || 0));
};

/** Duration between two datetimes as "HH:MM". */
const durationHM = (start, end) => {
  const a = parseDT(start);
  const b = parseDT(end);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
  const mins = Math.max(0, Math.round((b - a) / 60000));
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
};

const toRow = (t = {}, i) => {
  const start = t.start_time ?? t.start ?? '';
  const end = t.end_time ?? t.end ?? '';
  const name = t.name ?? t.task ?? t.action ?? '';
  return {
    id: t.id ?? i,
    name,
    isClock: /^clock\s?(in|out)$/i.test(name.trim()),
    start: hm(start),
    end: hm(end),
    duration: t.duration ?? durationHM(start, end),
  };
};

export default function JobsheetTab({ employee }) {
  const [date, setDate] = useState(todayISO());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!employee?.id) return undefined;
    let alive = true;
    setLoading(true);
    setError('');
    employeeService
      .getJobsheet({ userId: employee.id, date })
      .then((tasks) => { if (alive) setRows(tasks.map(toRow)); })
      .catch((err) => { if (alive) setError(err?.message || 'Could not load the jobsheet.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [employee?.id, date]);

  const { label, weekday } = describeDate(date);

  const exportPdf = () => {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    const esc = (s) =>
      String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const body = rows.length
      ? rows.map((r) => `<tr><td class="task">${r.isClock ? `<strong>${esc(r.name)}</strong>` : esc(r.name)}</td>` +
          `<td>${esc(r.start)}</td><td>${esc(r.end)}</td><td>${esc(r.duration)}</td></tr>`).join('')
      : '<tr><td colspan="4" style="text-align:center;padding:24px;color:#888">No tasks for this date.</td></tr>';
    const logo = `${window.location.origin}/seewe-logo.jpg`;
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Timesheet — ${esc(employee?.name)} — ${esc(label)}</title>` +
      `<style>*{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;box-sizing:border-box;` +
      `-webkit-print-color-adjust:exact;print-color-adjust:exact}` +
      `body{margin:24px;color:#111}` +
      `.brand-logo{height:44px;width:auto;display:block;margin-bottom:14px}` +
      `.ft{margin-top:18px;text-align:center;font-size:11px;color:#888;border-top:1px solid #eee;padding-top:10px}` +
      `.hd{background:#163d72;color:#fff;padding:16px 20px;display:flex;` +
      `justify-content:space-between;align-items:center;border-radius:8px 8px 0 0}.hd .name{font-size:18px;font-weight:700}` +
      `.hd .sub{font-size:12px;opacity:.85}` +
      `table{width:100%;border-collapse:collapse;border:1px solid #e5e5e5;border-top:none}` +
      `th{background:#eaf1fb;text-align:left;padding:10px 14px;font-size:12px;color:#1F488D}` +
      `td{padding:10px 14px;font-size:13px;border-top:1px solid #f0f0f0}@media print{body{margin:0}}</style></head>` +
      `<body onload="setTimeout(function(){window.print()},400)">` +
      `<img class="brand-logo" src="${logo}" alt="SeeWe Work"/>` +
      `<div class="hd"><div><div class="name">${esc(employee?.name)}</div><div class="sub">${esc(employee?.pos)}</div></div>` +
      `<div style="text-align:right"><div class="name">${esc(label)}</div><div class="sub">${esc(weekday)}</div></div></div>` +
      `<table><thead><tr><th>Task / Action</th><th>Start</th><th>End</th><th>Duration</th></tr></thead><tbody>${body}</tbody></table>` +
      `<footer class="ft"><a href="https://client.seewework.com" style="color:#1F488D">Client.seewework.com</a> · Powered by <strong style="color:#1F488D">SeeWe</strong></footer>` +
      `</body></html>`
    );
    win.document.close();
    win.focus();
  };

  const cols = [
    {
      key: 'name',
      header: 'Task / Action',
      render: (r) => (r.isClock ? <strong>{r.name}</strong> : r.name),
    },
    { key: 'start',    header: 'Start' },
    { key: 'end',      header: 'End' },
    { key: 'duration', header: 'Duration' },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: 'var(--c-text-soft)', fontWeight: 600 }}>Select Date:</label>
        <input type="date" className="tiny-input" style={{ maxWidth: 180 }}
          value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="button" className="btn bol" onClick={exportPdf} disabled={loading || rows.length === 0}>
          ⭳ Export PDF
        </button>
      </div>

      <div className="section-hd">Timesheet Report</div>

      <div style={{ border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{
          background: 'var(--brand-primary-dark)', color: '#fff',
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{employee?.name}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{employee?.pos}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{weekday}</div>
          </div>
        </div>

        {loading ? (
          <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Loading jobsheet…</p>
        ) : error ? (
          <p style={{ padding: 20, color: 'var(--c-danger)' }}>{error}</p>
        ) : (
          <DataTable columns={cols} rows={rows} getRowKey={(r) => r.id} emptyText="No tasks for this date." />
        )}
      </div>
    </>
  );
}
