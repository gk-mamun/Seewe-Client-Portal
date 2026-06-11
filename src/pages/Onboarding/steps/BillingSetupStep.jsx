import FormField from '../../../components/FormField/FormField.jsx';

export default function BillingSetupStep({ data, onChange }) {
  return (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>Billing Setup</h2>
      <p style={{ fontSize: 13, color: 'var(--c-text-soft)', marginBottom: 28 }}>
        How would you like to be invoiced?
      </p>
      <div className="form-row">
        <FormField label="Billing Cycle" name="cycle" as="select"
          options={['Monthly', 'Quarterly']}
          value={data.cycle || 'Monthly'}
          onChange={(e) => onChange({ cycle: e.target.value })} />
        <FormField label="Payment Method" name="method" as="select"
          options={['Bank Transfer', 'Credit Card', 'Direct Debit']}
          value={data.method || 'Bank Transfer'}
          onChange={(e) => onChange({ method: e.target.value })} />
      </div>
      <div className="form-row full">
        <FormField label="Invoice Email" name="invEmail" type="email"
          placeholder="finance@yourcompany.com"
          value={data.invEmail || ''}
          onChange={(e) => onChange({ invEmail: e.target.value })} />
      </div>
    </>
  );
}
