import { useEffect, useState } from 'react';
import DataTable from '../../../components/DataTable/DataTable.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { claimsService } from '../../../services/claimsService.js';
import { formatHKD } from '../../../utils/format.js';

const STATUS_TONE = { Pending: 'amb', Approved: 'grn', Rejected: 'red' };

export default function ClaimsTab({ employee }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    claimsService.list().then((all) => setRows(all.filter((c) => c.empId === employee.id)));
  }, [employee.id]);

  const cols = [
    { key: 'date',   header: 'Date' },
    { key: 'type',   header: 'Type' },
    { key: 'amount', header: 'Amount', render: (r) => formatHKD(r.amount) },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
  ];

  return (
    <>
      <div className="section-hd">Claims History</div>
      <DataTable columns={cols} rows={rows} emptyText="No claims yet." />
    </>
  );
}
