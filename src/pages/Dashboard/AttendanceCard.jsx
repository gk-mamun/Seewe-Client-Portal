import { useEffect, useState } from 'react';
import Card from '../../components/Card/Card.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import './attendance.css';

const STATUS_TONE = { 'Clocked Out': 'grn', Working: 'blu', 'On Leave': 'gry', Absent: 'red' };
const PAGE_SIZE = 10;

function timeOrDash(t) {
  return t ? <span className="att-time">{t}</span> : <span className="att-dash">—</span>;
}

export default function AttendanceCard({ rows = [], dateLabel }) {
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [rows.length]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <Card
      title="⏰ Today's Attendance — Clock Status"
      actions={dateLabel && <span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>{dateLabel}</span>}
      bodyPadding={false}
    >
      <div className="tw">
        <table className="tb att-tb">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Clock In</th>
              <th>Break Out</th>
              <th>Break Return</th>
              <th>Clock Out</th>
              <th>Total Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--c-text-soft)' }}>
                  No attendance records for today.
                </td>
              </tr>
            ) : (
              pageRows.map((r, i) => (
                <tr key={r.id ?? r.name ?? i}>
                  <td data-label="Employee">
                    <div className="att-emp">
                      <Avatar initials={r.initials} color={r.color} photo={r.photo} alt={r.name} size={28} />
                      <strong>{r.name}</strong>
                    </div>
                  </td>
                  <td data-label="Clock In">    {timeOrDash(r.ci)}</td>
                  <td data-label="Break Out">   {timeOrDash(r.bo)}</td>
                  <td data-label="Break Return">{timeOrDash(r.bi)}</td>
                  <td data-label="Clock Out">   {timeOrDash(r.co)}</td>
                  <td data-label="Total Hours"><strong>{r.total || '—'}</strong></td>
                  <td data-label="Status">
                    {r.status ? <Badge tone={STATUS_TONE[r.status] || 'gry'}>{r.status}</Badge> : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--c-border-soft)' }}>
          <span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
            Page {safePage} of {totalPages} · {rows.length} employee(s)
          </span>
          <button type="button" className="btn bol" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <button type="button" className="btn bol" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </Card>
  );
}
