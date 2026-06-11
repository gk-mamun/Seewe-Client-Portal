import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import DataTable from '../../components/DataTable/DataTable.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import StatCard, { StatGrid } from '../../components/StatCard/StatCard.jsx';
import { claimsService } from '../../services/claimsService.js';
import { CLAIM_TYPES } from '../../data/claims.js';
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatHKD } from '../../utils/format.js';

const STATUS_TONE = { Pending: 'amb', Approved: 'grn', Rejected: 'red' };

const TABS = [
  { key: 'pending',  label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function ClaimsPage() {
  useDocumentTitle('Claims');
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  useEffect(() => {
    claimsService.list().then(setItems);
  }, []);

  const filtered = useFilteredList(
    items.filter((c) => c.status.toLowerCase() === tab),
    { search, filters: { type }, searchFields: ['name', 'type', 'receipt'] }
  );

  const totals = {
    pending:  items.filter((c) => c.status === 'Pending').reduce((s, c) => s + c.amount, 0),
    approved: items.filter((c) => c.status === 'Approved').reduce((s, c) => s + c.amount, 0),
    rejected: items.filter((c) => c.status === 'Rejected').reduce((s, c) => s + c.amount, 0),
  };

  const setStatus = (id, status) => claimsService.setStatus(id, status).then(setItems);

  const cols = [
    { key: 'date',   header: 'Date' },
    { key: 'name',   header: 'Employee' },
    { key: 'type',   header: 'Type' },
    { key: 'amount', header: 'Amount', render: (r) => formatHKD(r.amount) },
    { key: 'receipt', header: 'Receipt' },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) =>
        r.status === 'Pending' && (
          <>
            <Button variant="success" onClick={() => setStatus(r.id, 'Approved')}>Approve</Button>
            <Button variant="danger"  onClick={() => setStatus(r.id, 'Rejected')}>Reject</Button>
          </>
        ),
    },
  ];

  return (
    <>
      <PageHeader title="Claims" />

      <StatGrid>
        <StatCard label="Pending"  value={formatHKD(totals.pending)}  changeType="neu" />
        <StatCard label="Approved" value={formatHKD(totals.approved)} changeType="up" />
        <StatCard label="Rejected" value={formatHKD(totals.rejected)} changeType="dn" />
        <StatCard label="Total"    value={formatHKD(totals.pending + totals.approved + totals.rejected)} />
      </StatGrid>

      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      <Card bodyPadding={false}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search employee or receipt…"
          filters={[{ name: 'type', value: type, options: CLAIM_TYPES, onChange: setType, label: 'Type' }]}
          count={`${filtered.length} claim(s)`}
          onClear={() => { setSearch(''); setType('All'); }}
        />
        <DataTable columns={cols} rows={filtered} emptyText="No claims in this view." />
      </Card>
    </>
  );
}
