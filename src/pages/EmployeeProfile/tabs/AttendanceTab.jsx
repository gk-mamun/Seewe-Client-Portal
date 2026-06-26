import DataTable from '../../../components/DataTable/DataTable.jsx';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fmtDate = (dateStr) => {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return { date: dateStr, day: '' };
  const dt = new Date(y, m - 1, d);
  return { date: `${MONTHS[m - 1]} ${d}, ${y}`, day: DOW[dt.getDay()] };
};
const hm = (t) => String(t || '').slice(0, 5); // HH:MM:SS → HH:MM

/** Group raw clock-in/out events into one row per date. */
const toDailyRows = (events = []) => {
  const byDate = {};
  for (const a of events) {
    const key = a.date;
    if (!byDate[key]) byDate[key] = { date: key, ins: [], outs: [] };
    if (a.status === 'clockin' && a.time) byDate[key].ins.push(a.time);
    else if (a.status === 'clockout' && a.time) byDate[key].outs.push(a.time);
  }
  return Object.values(byDate)
    .sort((a, b) => b.date.localeCompare(a.date)) // most recent first
    .map((g) => {
      const { date, day } = fmtDate(g.date);
      return {
        date,
        day,
        checkIn: g.ins.length ? hm([...g.ins].sort()[0]) : '—',
        checkOut: g.outs.length ? hm([...g.outs].sort().slice(-1)[0]) : '—',
        status: g.ins.length ? 'Present' : '—',
      };
    });
};

export default function AttendanceTab({ employee }) {
  const rows = toDailyRows(employee?.attendance);

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
      <DataTable
        columns={cols}
        rows={rows}
        getRowKey={(r) => r.date}
        emptyText="No attendance records in the last 30 days."
      />
    </>
  );
}
