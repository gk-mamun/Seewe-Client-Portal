import Card from '../../components/Card/Card.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import { TODAY_CLOCK } from '../../data/attendance.js';
import './attendance.css';

const STATUS_TONE = { 'Clocked Out': 'grn', Working: 'blu', 'On Leave': 'neu' };

function timeOrDash(t) {
  return t ? <span className="att-time">{t}</span> : <span className="att-dash">—</span>;
}

export default function AttendanceCard({ dateLabel = '1 Jun 2026 (Monday)' }) {
  return (
    <Card
      title="⏰ Today's Attendance — Clock Status"
      actions={<span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>{dateLabel}</span>}
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
            {TODAY_CLOCK.map((r) => (
              <tr key={r.name}>
                <td data-label="Employee">
                  <div className="att-emp">
                    <Avatar initials={r.initials} color={r.color} size={28} />
                    <strong>{r.name}</strong>
                  </div>
                </td>
                <td data-label="Clock In">    {timeOrDash(r.ci)}</td>
                <td data-label="Break Out">   {timeOrDash(r.bo)}</td>
                <td data-label="Break Return">{timeOrDash(r.bi)}</td>
                <td data-label="Clock Out">   {timeOrDash(r.co)}</td>
                <td data-label="Total Hours"><strong>{r.total}</strong></td>
                <td data-label="Status">
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
