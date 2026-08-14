import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../components/DataTable/DataTable.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { assetUrl } from '../../../config/api.js';
import { CLAIM_TYPE_ICONS } from '../../../data/claims.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};
const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const fmtMYR = (v) => `MYR ${toNum(v).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const STATUS_TONE = { pending: 'amb', approved: 'grn', rejected: 'red', paid: 'blu' };
const PAGE_SIZE = 8;

const toRow = (c = {}, i) => {
  const ref =
    c.invoice_no ??
    c.claim_no ??
    (c.id != null ? `CL${String(c.id).padStart(3, '0')}` : `#${i + 1}`);
  return {
    id: c.id ?? i,
    ref,
    type: c.type ?? c.claim_type ?? c.category ?? '',
    amount: toNum(c.actual_claim_amount ?? c.amount ?? c.cost),
    dateRaw: String(c.purchase_date ?? c.date ?? c.created_at ?? '').slice(0, 10),
    date: fmtDate(c.purchase_date ?? c.date ?? c.created_at),
    desc: c.description ?? c.desc ?? c.reason ?? c.remarks ?? '',
    status: c.status ?? '',
    file: (c.file ?? c.receipt ?? c.attachment) ? assetUrl(c.file ?? c.receipt ?? c.attachment) : '',
    fileName: String(c.file ?? c.receipt ?? c.attachment ?? '').split('/').pop() || 'Receipt',
  };
};

function StatCard({ label, value, tone = 'plain' }) {
  const styles = {
    plain:    { bg: '#fff',    border: 'var(--c-border)', label: 'var(--c-text-soft)', value: 'var(--c-text)' },
    pending:  { bg: '#fff7ed', border: '#fed7aa',         label: '#9a6a00',            value: '#b45309' },
    approved: { bg: '#f0fdf4', border: '#bbf7d0',         label: '#166534',            value: '#166534' },
  }[tone];
  return (
    <article
      style={{
        flex: 1, minWidth: 180, background: styles.bg,
        border: `1px solid ${styles.border}`, borderRadius: 'var(--r-lg)',
        padding: '18px 20px', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: styles.label }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6, color: styles.value }}>{value}</div>
    </article>
  );
}

export default function ClaimsTab({ employee }) {
  const rows = useMemo(() => (employee?.claims ?? []).map(toRow), [employee]);

  // Top stats (across all claims, unfiltered).
  const stats = useMemo(() => {
    const pending = rows.filter((r) => String(r.status).toLowerCase() === 'pending').length;
    const approvedAmt = rows
      .filter((r) => String(r.status).toLowerCase() === 'approved')
      .reduce((sum, r) => sum + r.amount, 0);
    return { total: rows.length, pending, approvedAmt };
  }, [rows]);

  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.dateRaw.slice(0, 4)).filter((y) => /^\d{4}$/.test(y)))).sort().reverse(),
    [rows]
  );
  const types = useMemo(
    () => Array.from(new Set(rows.map((r) => r.type).filter(Boolean))),
    [rows]
  );

  const [fYear, setFYear] = useState('All');
  const [fType, setFType] = useState('All');
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [fYear, fType]);

  const filtered = useMemo(
    () => rows.filter((r) =>
      (fYear === 'All' || r.dateRaw.startsWith(fYear)) &&
      (fType === 'All' || r.type === fType)
    ),
    [rows, fYear, fType]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const cols = [
    { key: 'ref', header: 'ID' },
    {
      key: 'type',
      header: 'Type',
      render: (r) => (r.type ? <span>{CLAIM_TYPE_ICONS[r.type] || '💰'} {r.type}</span> : '—'),
    },
    { key: 'amount', header: 'Amount', render: (r) => <strong>{fmtMYR(r.amount)}</strong> },
    { key: 'date', header: 'Date', render: (r) => r.date || '—' },
    { key: 'desc', header: 'Description', render: (r) => r.desc || '—' },
    {
      key: 'file',
      header: 'Receipt',
      render: (r) =>
        r.file ? (
          <a href={r.file} target="_blank" rel="noopener noreferrer" className="btn bol">
            View
          </a>
        ) : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) =>
        r.status ? <Badge tone={STATUS_TONE[String(r.status).toLowerCase()] || 'gry'}>{r.status}</Badge> : '—',
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label="Total Claims" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} tone="pending" />
        <StatCard label="Approved Amt" value={fmtMYR(stats.approvedAmt)} tone="approved" />
      </div>

      <div className="section-hd">Claims History</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <select className="tiny-select" style={{ maxWidth: 130 }} value={fYear} onChange={(e) => setFYear(e.target.value)}>
          <option value="All">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="tiny-select" style={{ maxWidth: 180 }} value={fType} onChange={(e) => setFType(e.target.value)}>
          <option value="All">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <DataTable
        columns={cols}
        rows={pageRows}
        getRowKey={(r) => r.id}
        emptyText="No claims in this view."
        landscape
      />

      {filtered.length > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
            Page {safePage} of {totalPages} · {filtered.length} claim(s)
          </span>
          <button type="button" className="btn bol" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <button type="button" className="btn bol" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </>
  );
}
