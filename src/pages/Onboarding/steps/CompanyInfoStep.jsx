import FormField from '../../../components/FormField/FormField.jsx';

export default function CompanyInfoStep({ data, onChange }) {
  return (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>Company Information</h2>
      <p style={{ fontSize: 13, color: 'var(--c-text-soft)', marginBottom: 28 }}>
        Tell us about your company so we can set up the right legal & billing structure.
      </p>

      <div className="form-row">
        <FormField label="Company Name" name="companyName"
          value={data.companyName || ''}
          onChange={(e) => onChange({ companyName: e.target.value })} />
        <FormField label="Trade Name" name="tradeName"
          value={data.tradeName || ''}
          onChange={(e) => onChange({ tradeName: e.target.value })} />
      </div>
      <div className="form-row">
        <FormField label="Registered Country" name="country" as="select"
          options={['Hong Kong', 'Malaysia', 'Singapore', 'Taiwan', 'Philippines']}
          value={data.country || 'Hong Kong'}
          onChange={(e) => onChange({ country: e.target.value })} />
        <FormField label="Industry" name="industry"
          value={data.industry || ''} placeholder="e.g. Software, Retail…"
          onChange={(e) => onChange({ industry: e.target.value })} />
      </div>
      <div className="form-row full">
        <FormField label="Registered Address" as="textarea" name="address"
          value={data.address || ''}
          onChange={(e) => onChange({ address: e.target.value })} />
      </div>
    </>
  );
}
