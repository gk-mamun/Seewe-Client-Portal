import CountrySelect from '../../../components/CountrySelect/CountrySelect.jsx';
import ChargeChip from '../../../components/ChargeChip/ChargeChip.jsx';
import { ALL_CHARGES } from '../../../data/deptLeads.js';

const CONTACT_PREFS = ['WhatsApp', 'Email', 'Both'];

/**
 * One dept-lead card (Operations / Finance / HR / IT, or a custom dept).
 * Controlled — page passes `lead` + `onChange(patch)`.
 */
export default function DeptLeadCard({
  lead,
  onChange,
  onToggleSameAsOps,
  onRemove,
  editing = false,
  deleting = false,
  isOps = false,
  showSameAsOps = false,
}) {
  const set = (patch) => onChange?.({ ...lead, ...patch });

  const toggleCharge = (charge) => {
    const has = lead.charges.includes(charge);
    set({
      charges: has ? lead.charges.filter((c) => c !== charge) : [...lead.charges, charge],
    });
  };

  // Show the standard charges plus any backend value not in the built-in
  // list (e.g. "Service Agreement") so the contact's data is fully reflected.
  const chargeOptions = [
    ...ALL_CHARGES,
    ...(lead.charges || []).filter((c) => !ALL_CHARGES.includes(c)),
  ];

  return (
    <article className="dept-lead-card">
      <header className="dlc-hd">
        <div className="dlc-title">
          <span className="dlc-icon" aria-hidden="true">{lead.icon}</span>
          <span>{lead.dept}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showSameAsOps && !isOps && (
            <label className="dlc-same">
              <input type="checkbox" onChange={onToggleSameAsOps} />
              Same as Operations
            </label>
          )}
          {editing && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={deleting}
              aria-label="Remove contact"
              style={{
                border: 'none', background: 'none',
                cursor: deleting ? 'wait' : 'pointer',
                color: 'var(--c-danger)', fontSize: 15, lineHeight: 1, padding: 2,
                opacity: deleting ? 0.4 : 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <div className="grid-2" style={{ gap: 8 }}>
        <div className="field-block">
          <label className="tiny-label">Lead Name</label>
          <input className="tiny-input" value={lead.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="field-block">
          <label className="tiny-label">Job Title</label>
          <input className="tiny-input" value={lead.title} onChange={(e) => set({ title: e.target.value })} />
        </div>
      </div>

      <div className="field-block">
        <label className="tiny-label">Email</label>
        <input className="tiny-input" type="email" value={lead.email} onChange={(e) => set({ email: e.target.value })} />
      </div>

      <div className="grid-2" style={{ gap: 8 }}>
        <div className="field-block">
          <label className="tiny-label">Office Phone</label>
          <input className="tiny-input" placeholder="+852 3XXX XXXX"
            value={lead.officePhone || ''} onChange={(e) => set({ officePhone: e.target.value })} />
        </div>
        <div className="field-block">
          <label className="tiny-label">WhatsApp / Mobile</label>
          <input className="tiny-input" value={lead.phone} onChange={(e) => set({ phone: e.target.value })} />
        </div>
      </div>

      <div className="grid-2" style={{ gap: 8 }}>
        <div className="field-block">
          <label className="tiny-label">Contact Preference</label>
          <select className="tiny-select" value={lead.pref} onChange={(e) => set({ pref: e.target.value })}>
            {CONTACT_PREFS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="field-block">
          <label className="tiny-label">Location (Country)</label>
          <CountrySelect className="tiny-select" value={lead.loc} onChange={(v) => set({ loc: v })} />
        </div>
      </div>

      <div>
        <label className="tiny-label">In-Charge Of</label>
        <div className="dlc-charges">
          {chargeOptions.map((ch) => (
            <ChargeChip
              key={ch}
              charge={ch}
              selected={lead.charges.includes(ch)}
              onToggle={toggleCharge}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
