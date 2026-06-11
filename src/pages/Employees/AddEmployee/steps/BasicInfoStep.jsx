import AeField from '../AeField.jsx';
import CountrySelect from '../../../../components/CountrySelect/CountrySelect.jsx';

const GENDERS = ['— Select —', 'Male', 'Female', 'Prefer not to say'];
const DEPTS = ['— Select —', 'Technology', 'Operations', 'Finance', 'Marketing', 'Design', 'HR', 'Administration', 'Legal'];
const STATUSES = [
  'Active', 'Ongoing Onboard', 'Probation Period', 'Notice Period',
  'Ex-Employee (Resign)', 'Ex-Employee (Terminated)', 'Never Onboard',
];

export default function BasicInfoStep({ draft, set }) {
  return (
    <>
      <h2 className="ae-section">Basic Information</h2>
      <p className="ae-sub">Personal details for the new staff member.</p>

      <div className="ae-row2">
        <AeField label="Full Legal Name" required>
          <input type="text" placeholder="e.g. Tan Wei Ming"
            value={draft.name || ''} onChange={(e) => set({ name: e.target.value })} />
        </AeField>
        <AeField label="Preferred Name / Display Name">
          <input type="text" placeholder="e.g. Wei Ming"
            value={draft.pref || ''} onChange={(e) => set({ pref: e.target.value })} />
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Gender" required>
          <select value={draft.gender || GENDERS[0]} onChange={(e) => set({ gender: e.target.value })}>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </AeField>
        <AeField label="Date of Birth" required>
          <input type="date" value={draft.dob || ''} onChange={(e) => set({ dob: e.target.value })} />
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Nationality" required>
          <CountrySelect value={draft.nat || 'Malaysia'} onChange={(v) => set({ nat: v })} />
        </AeField>
        <AeField label="Phone / WhatsApp" required>
          <input type="tel" placeholder="+60 12-345 6789"
            value={draft.phone || ''} onChange={(e) => set({ phone: e.target.value })} />
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Department" required>
          <select value={draft.dept || DEPTS[0]} onChange={(e) => set({ dept: e.target.value })}>
            {DEPTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </AeField>
        <AeField label="Employment Status" required>
          <select value={draft.status || 'Active'} onChange={(e) => set({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Personal Email" required>
          <input type="email" placeholder="name@email.com"
            value={draft.email || ''} onChange={(e) => set({ email: e.target.value })} />
        </AeField>
        <AeField label="Holiday Country" required>
          <CountrySelect value={draft.holcountry || 'Malaysia'} onChange={(v) => set({ holcountry: v })} />
        </AeField>
      </div>
    </>
  );
}
