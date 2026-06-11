import { useState } from 'react';
import Alert from '../../../components/Alert/Alert.jsx';

const BILLING_SETTINGS = [
  { lbl: 'Invoice Currency',     val: 'HKD — Hong Kong Dollar' },
  { lbl: 'Payment Terms',        val: '1 month in advance' },
  { lbl: 'Invoice Frequency',    val: 'Monthly' },
  { lbl: 'Monthly Invoice Date', val: '15th of every month' },
];

export default function BillingTab() {
  const [contact, setContact] = useState({
    name: '', title: '', email: '', whatsapp: '',
  });
  const [agreement, setAgreement] = useState(null);

  const setC = (patch) => setContact((c) => ({ ...c, ...patch }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setAgreement(f);
  };

  return (
    <>
      <Alert tone="amber" title="Billing settings are managed by SeeWe Work">
        Contact your account manager to make changes.
      </Alert>

      {/* ── Settings + Contact ── */}
      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        <section className="bill-panel">
          <h3 className="bill-section-title">💳 Billing Settings</h3>
          {BILLING_SETTINGS.map((row) => (
            <div key={row.lbl} className="bill-row">
              <span className="bill-row-lbl">{row.lbl}</span>
              <span className="bill-row-val">{row.val}</span>
            </div>
          ))}
          <div className="bill-row">
            <span className="bill-row-lbl">Current Status</span>
            <span className="ba grn">Active</span>
          </div>
        </section>

        <section className="bill-panel">
          <h3 className="bill-section-title">📞 Your Billing Contact Information</h3>

          <div className="grid-2">
            <div className="field-block">
              <label className="tiny-label">Contact Person Name</label>
              <input className="tiny-input" placeholder="e.g. Sarah Lim"
                value={contact.name} onChange={(e) => setC({ name: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">Job Title</label>
              <input className="tiny-input" placeholder="e.g. Finance Manager"
                value={contact.title} onChange={(e) => setC({ title: e.target.value })} />
            </div>
          </div>
          <div className="field-block">
            <label className="tiny-label">Billing Email</label>
            <input className="tiny-input" type="email" placeholder="billing@yourcompany.com"
              value={contact.email} onChange={(e) => setC({ email: e.target.value })} />
          </div>
          <div className="field-block" style={{ marginBottom: 4 }}>
            <label className="tiny-label">WhatsApp (Invoice Notifications)</label>
            <input className="tiny-input" type="tel" placeholder="+852 XXXX XXXX"
              value={contact.whatsapp} onChange={(e) => setC({ whatsapp: e.target.value })} />
            <div className="hol-help">💬 Invoice notifications will be sent via WhatsApp</div>
          </div>
        </section>
      </div>

      {/* ── Payment Terms Notice ── */}
      <section className="bill-notice">
        <h4>⚠ Payment Terms &amp; Adjustment Notice</h4>
        <ul>
          <li>
            Payment is due <strong>1 month in advance</strong>. Invoice issued on the{' '}
            <strong>15th of each month</strong>.
          </li>
          <li>
            If there is a <strong>payment float</strong> (difference between expected and received amount),
            the adjustment will be reflected in the <strong>following month&apos;s invoice</strong>.
          </li>
          <li>
            Exchange rate follows the <strong>actual bank rate</strong> on the transaction date,
            per the signed service agreement.
          </li>
        </ul>
      </section>

      {/* ── Contract Agreement ── */}
      <section className="bill-panel">
        <h3 className="bill-section-title">📄 Contract Agreement</h3>
        <div className="bill-contract-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Upload Signed Agreement</div>
            <div style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
              Upload your signed service agreement or contract. Accepted formats: PDF, DOC, DOCX (max 10MB)
            </div>
          </div>
          <label className="bill-file-btn">
            <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFile} />
            <span className="btn bdk">📎 Choose File</span>
          </label>
        </div>
        {agreement && (
          <div className="bill-file-name">{agreement.name}</div>
        )}
      </section>
    </>
  );
}
