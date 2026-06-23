import { useEffect, useState } from 'react';
import DeptLeadCard from '../components/DeptLeadCard.jsx';
import ChargeChip from '../../../components/ChargeChip/ChargeChip.jsx';
import CountrySelect from '../../../components/CountrySelect/CountrySelect.jsx';
import Button from '../../../components/Button/Button.jsx';
import { ALL_CHARGES } from '../../../data/deptLeads.js';
import {
  companyService,
  contactToLead,
  contactFormToPayload,
} from '../../../services/companyService.js';

const CONTACT_PREFS = ['Email', 'WhatsApp', 'Both'];

const BLANK_NEW = {
  dept: '', lead: '', email: '', phone: '', wa: '', pref: 'Email', loc: 'Hong Kong SAR', charges: [],
};

export default function DeptLeadsTab({ editing, value, onChange, details, onContactAdded, onContactDeleted }) {
  // Dept leads come from the `contacts` collection. Source of truth is the
  // page-owned `value`; falls back to the fetched details on first render.
  const [leads, setLeads] = useState(() => value ?? (details?.contacts ?? []).map(contactToLead));
  const [form, setForm] = useState(BLANK_NEW);
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState('');
  const [addOk, setAddOk] = useState(false);
  const [actionErr, setActionErr] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Push edited leads up so the bulk Save includes them.
  useEffect(() => {
    onChange?.(leads);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads]);

  const updateLead = (idx, patch) =>
    setLeads((ls) => ls.map((l, i) => (i === idx ? patch : l)));

  // Delete a contact. Saved rows (with a real id) hit the backend; an unsaved
  // row is just dropped locally.
  const removeLead = async (lead) => {
    if (deletingId) return;
    const label = lead.name || lead.dept || 'this contact';
    if (!window.confirm(`Remove ${label}? This cannot be undone.`)) return;
    setActionErr('');
    if (Number.isInteger(lead.id)) {
      setDeletingId(lead.id);
      try {
        await companyService.deleteContact(lead.id);
      } catch (err) {
        setActionErr(err?.message || 'Could not delete contact. Please try again.');
        setDeletingId(null);
        return;
      }
      setDeletingId(null);
      onContactDeleted?.(lead.id); // fold into baseline so Cancel won't resurrect it
    }
    setLeads((ls) => ls.filter((l) => l !== lead));
  };

  const sameAsOps = (idx) => {
    const ops = leads[0];
    updateLead(idx, { ...leads[idx], ...ops, dept: leads[idx].dept, icon: leads[idx].icon, title: leads[idx].title });
  };

  const toggleNewCharge = (ch) =>
    setForm((f) => ({
      ...f,
      charges: f.charges.includes(ch) ? f.charges.filter((x) => x !== ch) : [...f.charges, ch],
    }));

  // Add a NEW contact via its own endpoint (saveClientContact), then show it
  // as a card. This is separate from the bulk Save.
  const addContact = async () => {
    if (adding) return;
    if (!form.dept.trim()) return setAddErr('Department name is required.');
    setAddErr('');
    setAddOk(false);
    setAdding(true);
    try {
      const payload = contactFormToPayload(form);
      const res = await companyService.saveContact(payload);
      const saved = res?.contact ?? payload; // prefer the row the backend returns
      setLeads((ls) => [...ls, contactToLead(saved)]);
      onContactAdded?.(saved); // fold into baseline so Cancel keeps it
      setForm(BLANK_NEW);
      setAddOk(true);
    } catch (err) {
      setAddErr(err?.message || 'Could not add contact. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="dept-leads-wrap">
      {actionErr && <div className="sett-error" role="alert" style={{ marginBottom: 12 }}>{actionErr}</div>}
      <div className="dept-leads-grid">
        {leads.length === 0 && (
          <p className="extra-dept-form-desc">No department leads on record yet.</p>
        )}
        {leads.map((lead, idx) => (
          <DeptLeadCard
            key={lead.id ?? idx}
            lead={lead}
            isOps={idx === 0}
            showSameAsOps={idx !== 0}
            editing={editing}
            deleting={deletingId != null && deletingId === lead.id}
            onChange={(patch) => updateLead(idx, patch)}
            onToggleSameAsOps={() => sameAsOps(idx)}
            onRemove={() => removeLead(lead)}
          />
        ))}
      </div>

      {editing && (
        <section className="extra-dept-form">
          <h3 className="extra-dept-form-hd">
            + Add Contact
            <span className="extra-dept-form-sub">(saved immediately)</span>
          </h3>
          <p className="extra-dept-form-desc">
            Add a new department lead / contact. This is saved on its own — separate from “Save Changes”.
          </p>

          <div className="extra-dept-form-box">
            <div className="tiny-label" style={{ marginBottom: 10 }}>New Contact</div>

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
                    selected={form.charges.includes(ch)} onToggle={toggleNewCharge} />
                ))}
              </div>
            </div>

            {addErr && <div className="sett-error" role="alert" style={{ marginBottom: 10 }}>{addErr}</div>}
            {addOk && <div className="sett-ok" role="status" style={{ marginBottom: 10 }}>✓ Contact added.</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={addContact} disabled={adding}>
                {adding ? 'Adding…' : '+ Add Contact'}
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
