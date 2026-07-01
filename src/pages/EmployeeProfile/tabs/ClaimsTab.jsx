import DataTable from '../../../components/DataTable/DataTable.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { assetUrl } from '../../../config/api.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};
const fmtAmount = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n.toFixed(2) : (v ?? '');
};

const STATUS_TONE = { pending: 'amb', approved: 'grn', rejected: 'red' };

const toRow = (c = {}, i) => ({
  id: c.id ?? i,
  date: fmtDate(c.purchase_date),
  invoice: c.invoice_no ?? '',
  cost: fmtAmount(c.cost),
  claim: fmtAmount(c.actual_claim_amount),
  status: c.status ?? '',
  file: c.file ? assetUrl(c.file) : '',
});

export default function ClaimsTab({ employee }) {
  const rows = (employee?.claims ?? []).map(toRow);

  const cols = [
    { key: 'invoice', header: 'Invoice No.' },
    { key: 'date',    header: 'Date' },
    { key: 'cost',    header: 'Cost' },
    { key: 'claim',   header: 'Claim Amount' },
    {
      key: 'status',
      header: 'Status',
      render: (r) =>
        r.status ? <Badge tone={STATUS_TONE[String(r.status).toLowerCase()] || 'gry'}>{r.status}</Badge> : '—',
    },
    {
      key: 'file',
      header: 'Receipt',
      render: (r) =>
        r.file ? (
          <a href={r.file} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            View
          </a>
        ) : '—',
    },
  ];

  return (
    <>
      <div className="section-hd">Claims — {new Date().getFullYear()}</div>
      <DataTable columns={cols} rows={rows} getRowKey={(r) => r.id} emptyText="No claims this year." landscape />
    </>
  );
}
