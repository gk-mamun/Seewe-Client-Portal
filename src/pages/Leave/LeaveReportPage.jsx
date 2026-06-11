import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import LeaveRequestItem from '../../components/LeaveRequestItem/LeaveRequestItem.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import { leaveService } from '../../services/leaveService.js';
import { LEAVE_TYPES } from '../../data/leaveApplications.js';
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
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  useEffect(() => {
    leaveService.list().then(setItems);
  }, []);

  const visible = useFilteredList(
    items.filter((a) => a.status.toLowerCase() === tab),
    { search, filters: { type }, searchFields: ['name', 'reason'] }
  );

  const handle = (setStatus) => (id) => leaveService.setStatus(id, setStatus).then(setItems);

  return (
    <>
      <PageHeader title="Leave Report" />

      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      <Card bodyPadding={false}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search employee or reason…"
          filters={[
            { name: 'type', value: type, options: LEAVE_TYPES, onChange: setType, label: 'Type' },
          ]}
          count={`${visible.length} request(s)`}
          onClear={() => { setSearch(''); setType('All'); }}
        />
        {visible.length === 0 ? (
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
