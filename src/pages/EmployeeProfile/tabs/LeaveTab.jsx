import DataTable from '../../../components/DataTable/DataTable.jsx';
import Badge from '../../../components/Badge/Badge.jsx';

const STATUS_TONE = { approved: 'grn', pending: 'amb', rejected: 'red', cancelled: 'gry' };

const fmtDate = (v) => String(v ?? '').slice(0, 10); // strip any time portion

/** Backend leave application → table row (field names read defensively). */
const toRow = (a = {}, i) => ({
  id: a.id ?? i,
  leaveType: a.leave_type ?? a.type ?? a.leave_type_name ?? a.leavetype ?? '',
  days: a.no_of_day ?? a.no_of_days ?? a.number_of_days ?? a.total_days ?? a.days ?? '',
  start: fmtDate(a.start_date ?? a.from_date ?? a.date_from),
  end: fmtDate(a.end_date ?? a.to_date ?? a.date_to),
  reason: a.reason ?? a.remarks ?? '',
  status: a.status ?? '',
});

export default function LeaveTab({ employee }) {
  const rows = (employee?.leaveApplications ?? []).map(toRow);

  const cols = [
    { key: 'leaveType', header: 'Leave Type' },
    { key: 'days',      header: 'No. of Days' },
    { key: 'start',     header: 'Start Date' },
    { key: 'end',       header: 'End Date' },
    { key: 'reason',    header: 'Reason' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const tone = STATUS_TONE[String(r.status).toLowerCase()] || 'gry';
        return r.status ? <Badge tone={tone}>{r.status}</Badge> : '—';
      },
    },
  ];

  return (
    <>
      <div className="section-hd">Leave Applications</div>
      <DataTable
        columns={cols}
        rows={rows}
        getRowKey={(r) => r.id}
        emptyText="No leave applications."
        landscape
      />
    </>
  );
}
