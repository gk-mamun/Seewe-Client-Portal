import FormField from '../../../components/FormField/FormField.jsx';

export default function ContactsStep({ data, onChange }) {
  return (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>Key Contacts</h2>
      <p style={{ fontSize: 13, color: 'var(--c-text-soft)', marginBottom: 28 }}>
        Who should we reach out to for HR, finance and emergencies?
      </p>

      <div className="form-section-lbl">HR Contact</div>
      <div className="form-row">
        <FormField label="Name"  name="hrName"  value={data.hrName  || ''} onChange={(e) => onChange({ hrName:  e.target.value })} />
        <FormField label="Email" name="hrEmail" value={data.hrEmail || ''} onChange={(e) => onChange({ hrEmail: e.target.value })} />
      </div>

      <div className="form-section-lbl">Finance Contact</div>
      <div className="form-row">
        <FormField label="Name"  name="finName"  value={data.finName  || ''} onChange={(e) => onChange({ finName:  e.target.value })} />
        <FormField label="Email" name="finEmail" value={data.finEmail || ''} onChange={(e) => onChange({ finEmail: e.target.value })} />
      </div>
    </>
  );
}
