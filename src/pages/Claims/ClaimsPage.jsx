import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import DataTable from '../../components/DataTable/DataTable.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import StatCard, { StatGrid } from '../../components/StatCard/StatCard.jsx';
import { claimsService } from '../../services/claimsService.js';
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatHKD } from '../../utils/format.js';

const STATUS_TONE = { Pending: 'amb', Approved: 'grn', Rejected: 'red' };

const TABS = [
  { key: 'pending',  label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};

export default function ClaimsPage() {
  useDocumentTitle('Claims');
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  useEffect(() => {
    let alive = true;
    claimsService
      .list()
      .then((rows) => { if (alive) { setItems(rows); setSummary(claimsService.getSummary()); } })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load claims.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const typeOptions = useMemo(
    () => ['All', ...Array.from(new Set(items.map((c) => c.type).filter(Boolean)))],
    [items]
  );

  const filtered = useFilteredList(
    items.filter((c) => c.status.toLowerCase() === tab),
    { search, filters: { type }, searchFields: ['name', 'email', 'type'] }
  );

  // Optimistic local update for now — backend endpoint to be wired later.
  const setStatus = (id, status) =>
    claimsService.setStatus(id, status).then((next) => setItems([...next]));

  const cols = [
    {
      key: 'name',
      header: 'Employee',
      render: (r) => (
        <div className="emp-cell">
          <Avatar initials={r.initials} color={r.color} photo={r.photo} alt={r.name} size={32} />
          <div>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-soft)' }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'type',   header: 'Type' },
    { key: 'amount', header: 'Amount', render: (r) => formatHKD(r.amount) },
    { key: 'date',   header: 'Date', render: (r) => fmtDate(r.date) },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status] || 'gry'}>{r.status}</Badge> },
    {
      key: 'actions',
      header: 'Action',
      render: (r) =>
        r.status === 'Pending' ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="success" onClick={() => setStatus(r.id, 'Approved')}>Approve</Button>
            <Button variant="danger"  onClick={() => setStatus(r.id, 'Rejected')}>Reject</Button>
          </div>
        ) : '—',
    },
  ];

  const total = Number(summary.total_amount || 0);

  return (
    <>
      <PageHeader title="Claims" />

      <StatGrid cols={5}>
        <StatCard label="Pending"  value={formatHKD(summary.total_pending)}  changeType="neu" />
        <StatCard label="Approved" value={formatHKD(summary.total_approved)} changeType="up" />
        <StatCard label="Paid"     value={formatHKD(summary.total_paid)}     changeType="up" />
        <StatCard label="Rejected" value={formatHKD(summary.total_rejected)} changeType="dn" />
        <StatCard label="Total"    value={formatHKD(total)} />
      </StatGrid>

      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      <Card bodyPadding={false}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search employee or type…"
          filters={[{ name: 'type', value: type, options: typeOptions, onChange: setType }]}
          count={`${filtered.length} claim(s)`}
          onClear={() => { setSearch(''); setType('All'); }}
        />
        {loading ? (
          <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Loading claims…</p>
        ) : error ? (
          <p style={{ padding: 20, color: 'var(--c-danger)' }}>{error}</p>
        ) : (
          <DataTable columns={cols} rows={filtered} emptyText="No claims in this view." />
        )}
      </Card>
    </>
  );
}
