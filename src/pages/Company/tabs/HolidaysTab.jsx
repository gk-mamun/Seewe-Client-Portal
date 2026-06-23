import { useEffect, useState } from 'react';
import CountrySelect from '../../../components/CountrySelect/CountrySelect.jsx';
import Button from '../../../components/Button/Button.jsx';
import { festivalToHoliday } from '../../../services/companyService.js';

const APPLY_COUNTRIES = ['Hong Kong', 'Malaysia', 'Philippines', 'Taiwan', 'Singapore', 'All Locations'];

const BLANK_CUSTOM = { name: '', date: '', time: '14:00', applies: [] };

export default function HolidaysTab({ editing, value, onChange, details }) {
  // Source of truth is the page-owned `value`; falls back to fetched details.
  const [hqCountry, setHqCountry] = useState(value?.hqCountry ?? (details?.country || ''));
  const [branchCountries, setBranchCountries] = useState(value?.branchCountries ?? []);
  const [branchPick, setBranchPick] = useState('');
  const [earlyOff, setEarlyOff] = useState(value?.earlyOff ?? []);
  // Holidays come from the `festivals` collection on /client/details.
  const [customs, setCustoms] = useState(() =>
    value?.customs ??
    (details?.festivals ?? []).map(festivalToHoliday).map((h) => ({ ...h, checked: true }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK_CUSTOM);

  // Push edits up so the bulk Save includes the holiday section.
  useEffect(() => {
    onChange?.({ hqCountry, branchCountries, earlyOff, customs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hqCountry, branchCountries, earlyOff, customs]);

  const addBranch = () => {
    if (!branchPick || branchCountries.includes(branchPick)) return;
    setBranchCountries([...branchCountries, branchPick]);
    setBranchPick('');
  };
  const removeBranch = (c) =>
    setBranchCountries((bs) => bs.filter((x) => x !== c));

  const setEarly = (id, patch) =>
    setEarlyOff((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const toggleApply = (co) =>
    setForm((f) => ({
      ...f,
      applies: f.applies.includes(co) ? f.applies.filter((x) => x !== co) : [...f.applies, co],
    }));

  const addCustom = () => {
    if (!form.name.trim()) return;
    setCustoms((cs) => [...cs, { ...form, id: `custom-${Date.now()}` }]);
    setForm(BLANK_CUSTOM);
    setShowAdd(false);
  };

  return (
    <>
      {/* ── HQ + Branch countries ── */}
      <section className="hol-panel">
        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <label className="hol-label">🎌 Which country&apos;s public holidays does your HQ follow?</label>
            <CountrySelect className="tiny-select" value={hqCountry} onChange={setHqCountry} />
            <div className="hol-help">Main company registration country — sets default public holidays</div>
          </div>
          <div>
            <label className="hol-label">
              🌐 Public Holidays in Other Branch Countries{' '}
              <span style={{ fontWeight: 400, fontStyle: 'italic' }}>(if applicable)</span>
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <CountrySelect
                className="tiny-select"
                value={branchPick}
                onChange={setBranchPick}
                includeEmpty
                style={{ flex: 1 }}
              />
              <Button onClick={addBranch} disabled={!branchPick || !editing}>+ Add</Button>
            </div>
            <div className="hol-help">You can add multiple branch countries. Each country&apos;s holidays will be included.</div>
            <div className="hol-branch-chips">
              {branchCountries.map((bc) => (
                <span key={bc} className="hol-branch-chip">
                  {bc}
                  <button type="button" aria-label="Remove" onClick={() => removeBranch(bc)}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="hol-toolbar">
        <span className="hol-toolbar-note">
          ⓘ Early-off days: staff leave before end of the working day. Set the time for each entry below.
        </span>
        {editing && <Button onClick={() => setShowAdd((v) => !v)}>+ Add Custom</Button>}
      </div>

      {/* ── Add Custom form ── */}
      {showAdd && (
        <section className="hol-add-form">
          <h4>⏲ Add Custom Early-Off Day</h4>

          <div className="hol-add-row">
            <div className="field-block">
              <label className="tiny-label">Occasion Name *</label>
              <input className="tiny-input" placeholder="e.g. Company Anniversary"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">Date (optional)</label>
              <input className="tiny-input" type="date"
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">Early Off Time</label>
              <input className="tiny-input" type="time"
                value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>

          <div className="field-block">
            <label className="tiny-label">Applies To (select all that apply)</label>
            <div className="hol-apply-chips">
              {APPLY_COUNTRIES.map((co) => (
                <label key={co} className="hol-apply-chip">
                  <input type="checkbox"
                    checked={form.applies.includes(co)}
                    onChange={() => toggleApply(co)} />
                  {co}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="outline" onClick={() => { setShowAdd(false); setForm(BLANK_CUSTOM); }}>Cancel</Button>
            <Button onClick={addCustom}>✓ Add</Button>
          </div>
        </section>
      )}

      {/* ── Default Early-Off Days ── */}
      <h4 className="hol-section-hd">⏲ Early Off Days ({earlyOff.length})</h4>
      <div className="hol-early-grid">
        {earlyOff.map((h) => (
          <div key={h.id} className="hol-early-card">
            <input type="checkbox" checked={h.checked}
              onChange={(e) => setEarly(h.id, { checked: e.target.checked })} />
            <div style={{ flex: 1 }}>
              <div className="hol-early-name">{h.name}</div>
            </div>
            <div className="hol-early-time">
              <span>Off at:</span>
              <input type="time" value={h.time}
                onChange={(e) => setEarly(h.id, { time: e.target.value })} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Custom Early-Off Days ── */}
      {customs.length > 0 && (
        <>
          <h4 className="hol-section-hd">📌 Custom Early-Off Days ({customs.length})</h4>
          <div className="hol-early-grid">
            {customs.map((h) => (
              <div key={h.id} className="hol-early-card">
                <input type="checkbox" checked readOnly />
                <div style={{ flex: 1 }}>
                  <div className="hol-early-name">{h.name}</div>
                  {h.date && <div className="hol-early-date">{h.date}</div>}
                  <div className="hol-early-applies">
                    Applies: {h.applies.length ? h.applies.join(', ') : 'All'}
                  </div>
                </div>
                <div className="hol-early-time-col">
                  <div className="hol-early-time">
                    <span>Off at:</span>
                    <input type="time" value={h.time} readOnly />
                  </div>
                  <button type="button" className="hol-remove-btn"
                    onClick={() => setCustoms((cs) => cs.filter((c) => c.id !== h.id))}>
                    ✕ remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
