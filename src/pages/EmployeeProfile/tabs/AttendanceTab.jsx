import DataTable from '../../../components/DataTable/DataTable.jsx';

const SAMPLE = [
  { date: 'Jun 5, 2026', day: 'Fri', checkIn: '09:02', checkOut: '18:15', status: 'Present' },
  { date: 'Jun 4, 2026', day: 'Thu', checkIn: '08:58', checkOut: '18:30', status: 'Present' },
  { date: 'Jun 3, 2026', day: 'Wed', checkIn: '09:10', checkOut: '18:05', status: 'Late' },
  { date: 'Jun 2, 2026', day: 'Tue', checkIn: '—',     checkOut: '—',     status: 'Leave' },
];

export default function AttendanceTab() {
  const cols = [
    { key: 'date',     header: 'Date' },
    { key: 'day',      header: 'Day' },
    { key: 'checkIn',  header: 'Check In' },
    { key: 'checkOut', header: 'Check Out' },
    { key: 'status',   header: 'Status' },
  ];
  return (
    <>
      <div className="section-hd">Attendance — Last 30 Days</div>
      <DataTable columns={cols} rows={SAMPLE} getRowKey={(r) => r.date} />
    </>
  );
}
