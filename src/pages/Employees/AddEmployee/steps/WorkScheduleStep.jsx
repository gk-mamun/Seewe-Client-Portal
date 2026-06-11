import AeField from '../AeField.jsx';
import './work-schedule.css';

const DAYS = [
  { key: 'mon', lbl: 'Monday' },
  { key: 'tue', lbl: 'Tuesday' },
  { key: 'wed', lbl: 'Wednesday' },
  { key: 'thu', lbl: 'Thursday' },
  { key: 'fri', lbl: 'Friday' },
  { key: 'sat', lbl: 'Saturday' },
  { key: 'sun', lbl: 'Sunday' },
];

const TIMEZONES = [
  'MYT — Malaysia Time (UTC+8)',
  'PHT — Philippines Time (UTC+8)',
  'HKT — Hong Kong Time (UTC+8)',
  'TWN — Taiwan Time (UTC+8)',
  'SGT — Singapore Time (UTC+8)',
  'ICT — Indochina Time (UTC+7)',
  'IST — India Standard Time (UTC+5:30)',
  'WIB — Western Indonesia (UTC+7)',
];

const BREAKS = [
  '1:00 PM – 2:00 PM',
  '12:00 PM – 1:00 PM',
  '12:30 PM – 1:30 PM',
  'No fixed break',
];

const LOCATIONS = ['Remote (WFH)', 'On-site (Office)', 'Hybrid', 'Client Site', 'Overseas'];

const DEFAULT_SCHEDULE = DAYS.reduce((acc, d, i) => {
  acc[d.key] = {
    on: i < 5,
    start: i < 5 ? '09:00' : '',
    end: i < 5 ? '18:00' : '',
    loc: 'Remote (WFH)',
  };
  return acc;
}, {});

export default function WorkScheduleStep({ draft, set }) {
  const sched = draft.schedule || DEFAULT_SCHEDULE;

  const update = (dayKey, patch) =>
    set({ schedule: { ...sched, [dayKey]: { ...sched[dayKey], ...patch } } });

  return (
    <>
      <h2 className="ae-section">Work Schedule</h2>
      <p className="ae-sub">Configure each day individually — different hours or locations per day.</p>

      <div className="ae-row2">
        <AeField label="Default Time Zone">
          <select value={draft.tz || TIMEZONES[0]} onChange={(e) => set({ tz: e.target.value })}>
            {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </AeField>
        <AeField label="Break Time">
          <select value={draft.break || BREAKS[0]} onChange={(e) => set({ break: e.target.value })}>
            {BREAKS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </AeField>
      </div>

      <div className="ws-table-wrap">
        <div className="ws-table-hd">
          <span>Day</span>
          <span>Start Time</span>
          <span>End Time</span>
          <span>Location / Arrangement</span>
        </div>
        <table className="ws-table">
          <tbody>
            {DAYS.map((d) => {
              const row = sched[d.key];
              return (
                <tr key={d.key} className={row.on ? '' : 'is-off'}>
                  <td>
                    <label className="ws-day-cell">
                      <input
                        type="checkbox"
                        checked={row.on}
                        onChange={(e) => update(d.key, { on: e.target.checked })}
                      />
                      <span>{d.lbl}</span>
                    </label>
                  </td>
                  <td>
                    <input type="time" value={row.on ? row.start : ''} disabled={!row.on}
                      onChange={(e) => update(d.key, { start: e.target.value })} />
                  </td>
                  <td>
                    <input type="time" value={row.on ? row.end : ''} disabled={!row.on}
                      onChange={(e) => update(d.key, { end: e.target.value })} />
                  </td>
                  <td>
                    <select value={row.loc} disabled={!row.on}
                      onChange={(e) => update(d.key, { loc: e.target.value })}>
                      {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ae-note ae-note--green">
        📌 Each day can have different start/end times and locations — useful for hybrid schedules
        or employees working across multiple sites.
      </div>
    </>
  );
}
