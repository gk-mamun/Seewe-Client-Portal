import { useState } from 'react';
import DeptLeadCard from '../components/DeptLeadCard.jsx';
import ChargeChip from '../../../components/ChargeChip/ChargeChip.jsx';
import CountrySelect from '../../../components/CountrySelect/CountrySelect.jsx';
import Button from '../../../components/Button/Button.jsx';
import { ALL_CHARGES } from '../../../data/deptLeads.js';
import { contactToLead } from '../../../services/companyService.js';

const CONTACT_PREFS = ['Email', 'WhatsApp', 'Both'];

const BLANK_EXTRA = {
  dept: '', lead: '', email: '', phone: '', wa: '', pref: 'Email', loc: 'Hong Kong SAR', charges: [],
};

export default function DeptLeadsTab({ editing, details }) {
  // Dept leads come from the `contacts` collection on /client/details.
  const [leads, setLeads] = useState(() => (details?.contacts ?? []).map(contactToLead));
  const [extras, setExtras] = useState([]);
  const [form, setForm] = useState(BLANK_EXTRA);

  const updateLead = (idx, patch) =>
    setLeads((ls) => ls.map((l, i) => (i === idx ? patch : l)));

  const sameAsOps = (idx) => {
    const ops = leads[0];
    updateLead(idx, { ...leads[idx], ...ops, dept: leads[idx].dept, icon: leads[idx].icon, title: leads[idx].title });
  };

  const toggleExtraCharge = (ch) =>
    setForm((f) => ({
      ...f,
      charges: f.charges.includes(ch) ? f.charges.filter((x) => x !== ch) : [...f.charges, ch],
    }));

  const addExtra = () => {
    if (!form.dept.trim()) return;
    setExtras((xs) => [...xs, form]);
    setForm(BLANK_EXTRA);
  };

  const removeExtra = (idx) => setExtras((xs) => xs.filter((_, i) => i !== idx));

  return (
    <div className="dept-leads-wrap">
      <div className="dept-leads-grid">
        {leads.length === 0 && (
          <p className="extra-dept-form-desc">No department leads on record yet.</p>
        )}
        {leads.map((lead, idx) => (
          <DeptLeadCard
            key={idx}
            lead={lead}
            isOps={idx === 0}
            showSameAsOps={idx !== 0}
            onChange={(patch) => updateLead(idx, patch)}
            onToggleSameAsOps={() => sameAsOps(idx)}
          />
        ))}
      </div>

      {extras.length > 0 && (
        <aside className="extra-depts-col">
          <h4 className="extra-depts-hd">Additional Depts ({extras.length})</h4>
          {extras.map((d, di) => (
            <article key={di} className="extra-dept-summary">
              <header>
                <span>{d.dept}</span>
                <button type="button" aria-label="Remove" onClick={() => removeExtra(di)}>✕</button>
              </header>
              <Row label="Lead" value={d.lead} />
              {d.phone && <Row label="Office Phone" value={d.phone} />}
              {d.wa    && <Row label="WhatsApp"    value={d.wa} />}
              {d.email && <Row label="Email"       value={d.email} />}
              <Row label="Location" value={d.loc} />
              {d.charges.length > 0 && (
                <>
                  <span className="tiny-label" style={{ marginTop: 6 }}>In-Charge Of</span>
                  <div className="dlc-charges">
                    {d.charges.map((c) => <ChargeChip key={c} charge={c} selected readOnly />)}
                  </div>
                </>
              )}
            </article>
          ))}
        </aside>
      )}

      {editing && (
        <section className="extra-dept-form">
          <h3 className="extra-dept-form-hd">
            + Additional Departments
            <span className="extra-dept-form-sub">(optional)</span>
          </h3>
          <p className="extra-dept-form-desc">
            Add other departments such as Marketing, Design, Legal, etc. Saved entries appear in the side column.
          </p>

          <div className="extra-dept-form-box">
            <div className="tiny-label" style={{ marginBottom: 10 }}>New Department</div>

            <div className="grid-3">
              <div className="field-block">
                <label className="tiny-label">Department Name *</label>
                <input className="tiny-input" placeholder="e.g. Marketing"
                  value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
              </div>
              <div className="field-block">
                <label className="tiny-label">Lead Name</label>
                <input className="tiny-input" placeholder="e.g. Eva Wong"
                  value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} />
              </div>
              <div className="field-block">
                <label className="tiny-label">Email</label>
                <input className="tiny-input" placeholder="dept@company.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="grid-3">
              <div className="field-block">
                <label className="tiny-label">Office Phone</label>
                <input className="tiny-input" placeholder="+852 3XXX XXXX"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field-block">
                <label className="tiny-label">WhatsApp / Mobile</label>
                <input className="tiny-input" placeholder="+852 9XXX XXXX"
                  value={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.value })} />
              </div>
              <div className="field-block">
                <label className="tiny-label">Contact Preference</label>
                <select className="tiny-select" value={form.pref}
                  onChange={(e) => setForm({ ...form, pref: e.target.value })}>
                  {CONTACT_PREFS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="field-block">
              <label className="tiny-label">Location (Country)</label>
              <CountrySelect className="tiny-select" value={form.loc} onChange={(v) => setForm({ ...form, loc: v })} />
            </div>

            <div className="field-block">
              <label className="tiny-label">In-Charge Of</label>
              <div className="dlc-charges">
                {ALL_CHARGES.map((ch) => (
                  <ChargeChip key={ch} charge={ch}
                    selected={form.charges.includes(ch)} onToggle={toggleExtraCharge} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={addExtra}>+ Add Department</Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="extra-dept-row">
      <span className="tiny-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}
