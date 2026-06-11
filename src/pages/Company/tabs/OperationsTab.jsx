import { useState } from 'react';
import TimezoneSelect from '../../../components/TimezoneSelect/TimezoneSelect.jsx';
import CountrySelect from '../../../components/CountrySelect/CountrySelect.jsx';
import Button from '../../../components/Button/Button.jsx';
import { COUNTRY_TZ } from '../../../data/countries.js';

const WEEKDAYS = [
  { k: 'mon', l: 'Monday' },
  { k: 'tue', l: 'Tuesday' },
  { k: 'wed', l: 'Wednesday' },
  { k: 'thu', l: 'Thursday' },
  { k: 'fri', l: 'Friday' },
  { k: 'sat', l: 'Saturday' },
  { k: 'sun', l: 'Sunday' },
];

const DAY_CHIPS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_SCHEDULE = WEEKDAYS.reduce((acc, d, i) => {
  acc[d.k] = { enabled: i < 5, start: '09:00', end: '18:00' };
  return acc;
}, {});

const DEFAULT_REMOTE_TEAMS = [
  {
    country: 'Malaysia',
    tz: 'MYT (UTC+8)',
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    start: '09:00', end: '18:00',
  },
  {
    country: 'Philippines',
    tz: 'PHT (UTC+8)',
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    start: '08:00', end: '17:00',
  },
];

const WORK_MODES = ['Hybrid', 'Work From Home', 'In Office', 'All of the Above'];

export default function OperationsTab({ editing }) {
  const [tz, setTz] = useState('UTC+8 — HKT  Hong Kong Time (Default)');
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [remoteTeams, setRemoteTeams] = useState(DEFAULT_REMOTE_TEAMS);
  const [workMode, setWorkMode] = useState({ Hybrid: true });

  const [newTeam, setNewTeam] = useState({
    country: 'Malaysia', start: '09:00', end: '18:00',
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
  });

  const setDay = (key, patch) =>
    setSchedule((s) => ({ ...s, [key]: { ...s[key], ...patch } }));

  const addRemoteTeam = () => {
    setRemoteTeams((rs) => [
      ...rs,
      {
        country: newTeam.country,
        tz: COUNTRY_TZ[newTeam.country] || 'TBC',
        start: newTeam.start,
        end: newTeam.end,
        days: { ...newTeam.days },
      },
    ]);
  };

  const removeRemoteTeam = (idx) =>
    setRemoteTeams((rs) => rs.filter((_, i) => i !== idx));

  const toggleRemoteDay = (idx, dk) =>
    setRemoteTeams((rs) =>
      rs.map((t, i) => (i === idx ? { ...t, days: { ...t.days, [dk]: !t.days[dk] } } : t))
    );

  return (
    <>
      {/* ── Company Operation Hours ── */}
      <section className="sett-panel">
        <h3 className="section-hd">Your Company Operation Hours</h3>

        <div className="field-block" style={{ maxWidth: 460 }}>
          <label className="tiny-label">Company Time Zone</label>
          <TimezoneSelect className="tiny-select" value={tz} onChange={setTz} />
        </div>

        <div className="tiny-label" style={{ marginTop: 14, marginBottom: 10 }}>
          Daily Operation Hours
        </div>

        <div className="ops-table-wrap">
          <div className="ops-table-hd">
            <span>Day</span>
            <span>Working Hours (Start – End)</span>
          </div>
          <table className="ops-table">
            <tbody>
              {WEEKDAYS.map((d) => {
                const row = schedule[d.k];
                return (
                  <tr key={d.k} className={row.enabled ? '' : 'is-off'}>
                    <td>
                      <label className="ops-day-cell">
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={(e) => setDay(d.k, { enabled: e.target.checked })}
                        />
                        <span>{d.l}</span>
                      </label>
                    </td>
                    <td>
                      <div className="ops-time-row">
                        <input type="time" value={row.enabled ? row.start : ''}
                          disabled={!row.enabled}
                          onChange={(e) => setDay(d.k, { start: e.target.value })} />
                        <span>–</span>
                        <input type="time" value={row.enabled ? row.end : ''}
                          disabled={!row.enabled}
                          onChange={(e) => setDay(d.k, { end: e.target.value })} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Global Team Working Hours ── */}
      <section className="sett-panel">
        <h3 className="section-hd">Your Global Team Working Hours</h3>
        <p style={{ fontSize: 12, color: 'var(--c-text-soft)', marginBottom: 14 }}>
          Configure working hours per remote team location. Select working days and set hours for each country.
        </p>

        <div className="remote-teams-grid">
          {remoteTeams.map((t, idx) => (
            <article key={`${t.country}-${idx}`} className="remote-team-card">
              <header>
                <div>
                  <div className="rt-country">🌐 {t.country}</div>
                  <div className="rt-tz">{t.tz}</div>
                </div>
                <button type="button" aria-label="Remove" onClick={() => removeRemoteTeam(idx)}>✕</button>
              </header>

              <div className="rt-row">
                <span className="rt-row-lbl">Days:</span>
                <div className="rt-day-chips">
                  {WEEKDAYS.map((d, i) => (
                    <label key={d.k} className="rt-day-chip">
                      <input type="checkbox"
                        checked={!!t.days[d.k]}
                        onChange={() => toggleRemoteDay(idx, d.k)} />
                      <span style={{ color: t.days[d.k] ? 'var(--brand-primary-dark)' : '#bbb' }}>
                        {DAY_CHIPS[i]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rt-row">
                <span className="rt-row-lbl">Hours:</span>
                <input type="time" value={t.start}
                  onChange={(e) => setRemoteTeams((rs) => rs.map((x, i) => i === idx ? { ...x, start: e.target.value } : x))} />
                <span>–</span>
                <input type="time" value={t.end}
                  onChange={(e) => setRemoteTeams((rs) => rs.map((x, i) => i === idx ? { ...x, end: e.target.value } : x))} />
              </div>
            </article>
          ))}
        </div>

        {editing && (
          <div className="rt-add-box">
            <div className="tiny-label">Add Remote Team Location</div>

            <div className="grid-2">
              <div className="field-block">
                <label className="tiny-label">Country</label>
                <CountrySelect className="tiny-select" value={newTeam.country}
                  onChange={(v) => setNewTeam({ ...newTeam, country: v })} />
              </div>
              <div className="field-block">
                <label className="tiny-label">Working Hours</label>
                <div className="ops-time-row">
                  <input type="time" value={newTeam.start}
                    onChange={(e) => setNewTeam({ ...newTeam, start: e.target.value })} />
                  <span>–</span>
                  <input type="time" value={newTeam.end}
                    onChange={(e) => setNewTeam({ ...newTeam, end: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="field-block">
              <label className="tiny-label">Working Days</label>
              <div className="rt-day-chips">
                {WEEKDAYS.map((d, i) => (
                  <label key={d.k} className="rt-day-chip">
                    <input
                      type="checkbox"
                      checked={!!newTeam.days[d.k]}
                      onChange={() => setNewTeam((t) => ({ ...t, days: { ...t.days, [d.k]: !t.days[d.k] } }))}
                    />
                    <span style={{ color: newTeam.days[d.k] ? 'var(--brand-primary-dark)' : '#bbb' }}>
                      {DAY_CHIPS[i]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={addRemoteTeam}>+ Add Location</Button>
            </div>
          </div>
        )}
      </section>

      {/* ── Team Work Mode ── */}
      <section className="sett-panel">
        <h3 className="section-hd">
          Current Team Work Mode{' '}
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--c-text-fade)' }}>(optional)</span>
        </h3>
        <p style={{ fontSize: 12, color: 'var(--c-text-soft)', marginBottom: 14 }}>
          Select all that apply to your existing team&apos;s work arrangement.
        </p>
        <div className="work-mode-grid">
          {WORK_MODES.map((m) => (
            <label key={m} className="work-mode-pill">
              <input type="checkbox"
                checked={!!workMode[m]}
                onChange={() => setWorkMode((w) => ({ ...w, [m]: !w[m] }))} />
              {m}
            </label>
          ))}
        </div>
      </section>
    </>
  );
}
