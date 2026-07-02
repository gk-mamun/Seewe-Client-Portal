import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import LeaveRequestItem from '../../components/LeaveRequestItem/LeaveRequestItem.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import { leaveService } from '../../services/leaveService.js';
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

const TABS = [
  { key: 'pending',  label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function LeaveReportPage() {
  useDocumentTitle('Leave Report');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [actionErr, setActionErr] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let alive = true;
    leaveService
      .list()
      .then((rows) => { if (alive) setItems(rows); })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load leave applications.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const visible = useFilteredList(
    items.filter((a) => a.status.toLowerCase() === tab),
    { search, searchFields: ['name', 'email'] }
  );

  const handle = (setStatus) => async (id) => {
    if (busyId) return;
    setActionErr('');
    setBusyId(id);
    try {
      const next = await leaveService.setStatus(id, setStatus);
      setItems([...next]);
    } catch (err) {
      setActionErr(err?.message || 'Could not update the leave status. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Leave Report" />

      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      {actionErr && (
        <div role="alert" style={{
          margin: '0 0 12px', padding: '10px 14px', fontSize: 13, fontWeight: 600,
          background: 'var(--c-danger-bg)', border: '1px solid var(--c-danger-border)',
          color: 'var(--c-danger-dark)', borderRadius: 'var(--r-sm)',
        }}>{actionErr}</div>
      )}

      <Card bodyPadding={false}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search employee name or email…"
          count={`${visible.length} request(s)`}
          onClear={() => setSearch('')}
        />
        {loading ? (
          <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Loading leave applications…</p>
        ) : error ? (
          <p style={{ padding: 20, color: 'var(--c-danger)' }}>{error}</p>
        ) : visible.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>No requests in this view.</p>
        ) : (
          visible.map((r) => (
            <LeaveRequestItem
              key={r.id}
              request={r}
              onApprove={handle('Approved')}
              onReject={handle('Rejected')}
            />
          ))
        )}
      </Card>
    </>
  );
}
