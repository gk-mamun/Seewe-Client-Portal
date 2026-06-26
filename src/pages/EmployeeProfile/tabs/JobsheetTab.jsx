import DataTable from '../../../components/DataTable/DataTable.jsx';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtDate = (dateStr) => {
  const [y, m, d] = String(dateStr || '').split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (dateStr || '');
};
const hm = (t) => String(t || '').slice(0, 5); // HH:MM:SS → HH:MM

/** Parse "YYYY-MM-DD[ T]HH:MM[:SS]" into epoch ms, independent of the browser's
 *  Date parser (which can reject some datetime string variants). */
const parseDT = (s) => {
  const m = String(s ?? '').match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return NaN;
  const [, Y, Mo, D, H, Mi, S] = m;
  return Date.UTC(+Y, +Mo - 1, +D, +H, +Mi, +(S || 0));
};

/** Duration between two datetimes, as "Xh Ym". */
const duration = (start, end) => {
  const a = parseDT(start);
  const b = parseDT(end);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
  const mins = Math.round(Math.abs(b - a) / 60000);
  if (mins === 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ');
};

/** Backend jobsheet entry → table row. */
const toRow = (j = {}, i) => {
  const [sd, st] = String(j.start_time || '').split(' ');
  const [, et] = String(j.end_time || '').split(' ');
  return {
    id: j.id ?? i,
    sort: j.start_time || '',
    date: fmtDate(sd),
    time: st ? `${hm(st)} – ${hm(et) || '—'}` : '',
    task: j.name || j.task || j.description || '',
    duration: duration(j.start_time, j.end_time),
  };
};

export default function JobsheetTab({ employee }) {
  const rows = (employee?.jobsheet ?? [])
    .map(toRow)
    .sort((a, b) => b.sort.localeCompare(a.sort)); // most recent first

  const cols = [
    { key: 'date',     header: 'Date' },
    { key: 'time',     header: 'Time' },
    { key: 'task',     header: 'Task' },
    { key: 'duration', header: 'Duration' },
  ];

  return (
    <>
      <div className="section-hd">Jobsheet</div>
      <DataTable
        columns={cols}
        rows={rows}
        getRowKey={(r) => r.id}
        emptyText="No jobsheet records."
      />
    </>
  );
}
