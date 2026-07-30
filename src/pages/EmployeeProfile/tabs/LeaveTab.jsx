import { useMemo, useState } from 'react';
import DataTable from '../../../components/DataTable/DataTable.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import '../../../components/LeaveBalanceCard/LeaveBalanceCard.css';

const STATUS_TONE = { approved: 'grn', pending: 'amb', rejected: 'red', cancelled: 'gry', waiting: 'amb' };
const PAGE_SIZE = 10;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};

/** Backend leave application → table row (field names read defensively). */
const toRow = (a = {}, i) => {
  const startRaw = String(a.start_date ?? a.from_date ?? a.date_from ?? '').slice(0, 10);
  return {
    id: a.id ?? i,
    leaveType: a.leave_type ?? a.type ?? a.leave_type_name ?? a.leavetype ?? '',
    days: a.no_of_day ?? a.no_of_days ?? a.number_of_days ?? a.total_days ?? a.days ?? '',
    startRaw,
    start: fmtDate(startRaw),
    end: fmtDate(a.end_date ?? a.to_date ?? a.date_to),
    reason: a.reason ?? a.remarks ?? '',
    status: a.status ?? '',
  };
};

export default function LeaveTab({ employee }) {
  const entitlement = employee?.leaveSummary ?? [];
  const allRows = useMemo(() => (employee?.leaveApplications ?? []).map(toRow), [employee]);

  // Filter options derived from the data.
  const years = useMemo(
    () => Array.from(new Set(allRows.map((r) => r.startRaw.slice(0, 4)).filter(Boolean))).sort().reverse(),
    [allRows]
  );
  const types = useMemo(
    () => Array.from(new Set(allRows.map((r) => r.leaveType).filter(Boolean))),
    [allRows]
  );

  const [year, setYear] = useState('All');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => allRows.filter(
      (r) =>
        (year === 'All' || r.startRaw.startsWith(year)) &&
        (type === 'All' || r.leaveType === type)
    ),
    [allRows, year, type]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onFilter = (setter) => (v) => { setter(v); setPage(1); };

  const cols = [
    { key: 'leaveType', header: 'Type' },
    { key: 'start',     header: 'From' },
    { key: 'end',       header: 'To' },
    { key: 'days',      header: 'Days' },
    { key: 'reason',    header: 'Reason' },
    {
      key: 'status',
      header: 'Status',
      render: (r) =>
        r.status ? <Badge tone={STATUS_TONE[String(r.status).toLowerCase()] || 'gry'}>{r.status}</Badge> : '—',
    },
  ];

  return (
    <>
      {entitlement.length > 0 && (
        <>
          <div className="section-hd">Leave Entitlement ({new Date().getFullYear()})</div>
          <div className="leave-grid">
            {entitlement.map((b) => {
              const pct = b.total > 0 ? Math.min(100, Math.round((b.used / b.total) * 100)) : 0;
              return (
                <article key={b.label} className="leave-card">
                  <div className="l-type">{b.icon} {b.label}</div>
                  <div className="l-used">{b.used}<span className="l-total"> / {b.total}</span></div>
                  <div className="l-bar"><div className="l-fill" style={{ width: `${pct}%` }} /></div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-soft)', marginTop: 6 }}>
                    {b.remaining} days remaining
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <div className="section-hd" style={{ marginTop: entitlement.length ? 24 : 0 }}>Leave History</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <select className="tiny-select" style={{ maxWidth: 130 }} value={year} onChange={(e) => onFilter(setYear)(e.target.value)}>
          <option value="All">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="tiny-select" style={{ maxWidth: 180 }} value={type} onChange={(e) => onFilter(setType)(e.target.value)}>
          <option value="All">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <DataTable
        columns={cols}
        rows={pageRows}
        getRowKey={(r) => r.id}
        emptyText="No leave applications."
        landscape
      />

      {filtered.length > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
            Page {safePage} of {totalPages} · {filtered.length} record(s)
          </span>
          <button type="button" className="btn bol" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <button type="button" className="btn bol" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </>
  );
}
