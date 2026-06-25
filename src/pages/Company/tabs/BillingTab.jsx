import { useEffect, useState } from 'react';
import Alert from '../../../components/Alert/Alert.jsx';
import { assetUrl } from '../../../config/api.js';
import { companyService, detailsToBilling, detailsToBillingContact } from '../../../services/companyService.js';

const IMAGE_RE = /\.(jpe?g|png|gif|webp|bmp|svg)$/i;
const fileNameOf = (path) => String(path || '').split(/[\\/]/).pop() || 'agreement';

const STATUS_TONE = { active: 'grn', inactive: 'red', pending: 'amb' };
const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

/** Show a date (ISO date or datetime) as DD/MM/YYYY, ignoring any time/zone. */
const fmtDate = (v) => {
  const m = String(v ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (v ?? '');
};

/** Shared sizing so View and Choose File render as an equal-sized pair. */
const BTN_BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 34,
  padding: '0 16px',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  borderRadius: 'var(--r-sm)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  boxSizing: 'border-box',
};

export default function BillingTab({ editing, details, value, onChange }) {
  const billing = detailsToBilling(details);

  // Billing contact (purpose === 'billing') — editable; synced to the page so
  // it's saved with "Save Changes".
  const [billingContact, setBillingContact] = useState(() => value ?? detailsToBillingContact(details));
  const setBC = (patch) => setBillingContact((b) => ({ ...b, ...patch }));
  useEffect(() => {
    onChange?.(billingContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingContact]);

  // Existing signed agreement (from billing_info) or a freshly uploaded file.
  const [agreement, setAgreement] = useState(() => {
    const path = billing?.agreementPath;
    if (!path) return null;
    return { name: fileNameOf(path), url: assetUrl(path), isImage: IMAGE_RE.test(path) };
  });
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [uploadOk, setUploadOk] = useState(false);

  // Upload immediately to its own endpoint (independent of "Save Changes").
  const onPick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!f) return;
    setUploadErr('');
    setUploadOk(false);
    setUploading(true);
    try {
      const res = await companyService.uploadAgreement(f);
      const path = res?.agreement; // backend returns the stored path
      setAgreement(
        path
          ? { name: fileNameOf(path), url: assetUrl(path), isImage: IMAGE_RE.test(path) }
          : { name: f.name, url: URL.createObjectURL(f), isImage: f.type.startsWith('image/') || IMAGE_RE.test(f.name) }
      );
      setUploadOk(true);
    } catch (err) {
      setUploadErr(err?.message || 'Could not upload the agreement. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const ROWS = billing
    ? [
        { lbl: 'Invoice Currency',     val: billing.invoiceCurrency },
        { lbl: 'Payment Terms',        val: billing.paymentTerms },
        { lbl: 'Invoice Frequency',    val: billing.invoiceFrequency },
        { lbl: 'Monthly Invoice Date', val: fmtDate(billing.monthlyInvoiceDate) },
      ]
    : [];

  return (
    <>
      <Alert tone="amber" title="Billing settings are managed by SeeWe Work">
        Invoice settings are read-only. You can edit your billing contact and upload your signed agreement below.
      </Alert>

      {!billing ? (
        <p className="extra-dept-form-desc">No billing information available yet.</p>
      ) : (
        <>
          {/* ── Settings (read-only) + Contact ── */}
          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            <section className="bill-panel">
              <h3 className="bill-section-title">💳 Billing Settings</h3>
              {ROWS.map((row) => (
                <div key={row.lbl} className="bill-row">
                  <span className="bill-row-lbl">{row.lbl}</span>
                  <span className="bill-row-val">{row.val || '—'}</span>
                </div>
              ))}
              <div className="bill-row">
                <span className="bill-row-lbl">Current Status</span>
                <span className={`ba ${STATUS_TONE[billing.currentStatus] || 'grn'}`}>
                  {titleCase(billing.currentStatus) || '—'}
                </span>
              </div>
            </section>

            <section className="bill-panel">
              <h3 className="bill-section-title">📞 Your Billing Contact Information</h3>
              <div className="grid-2">
                <div className="field-block">
                  <label className="tiny-label">Contact Person Name</label>
                  <input className="tiny-input" placeholder="e.g. Sarah Lim"
                    value={billingContact.name} onChange={(e) => setBC({ name: e.target.value })} />
                </div>
                <div className="field-block">
                  <label className="tiny-label">Job Title</label>
                  <input className="tiny-input" placeholder="e.g. Finance Manager"
                    value={billingContact.title} onChange={(e) => setBC({ title: e.target.value })} />
                </div>
              </div>
              <div className="field-block">
                <label className="tiny-label">Billing Email</label>
                <input className="tiny-input" type="email" placeholder="billing@yourcompany.com"
                  value={billingContact.email} onChange={(e) => setBC({ email: e.target.value })} />
              </div>
              <div className="field-block" style={{ marginBottom: 4 }}>
                <label className="tiny-label">WhatsApp (Invoice Notifications)</label>
                <input className="tiny-input" type="tel" placeholder="+852 XXXX XXXX"
                  value={billingContact.whatsapp} onChange={(e) => setBC({ whatsapp: e.target.value })} />
                <div className="hol-help">💬 Invoice notifications will be sent via WhatsApp</div>
              </div>
            </section>
          </div>

          {/* ── Notice (HTML from backend) ── */}
          {billing.notice && (
            <section className="bill-notice">
              <h4>⚠ Payment Terms &amp; Adjustment Notice</h4>
              <div dangerouslySetInnerHTML={{ __html: billing.notice }} />
            </section>
          )}

          {/* ── Contract Agreement ── */}
          <section className="bill-panel">
            <h3 className="bill-section-title">📄 Contract Agreement</h3>
            <div className="bill-contract-row">
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Signed Agreement</div>
                <div style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
                  Upload your signed service agreement. Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                </div>
              </div>

              {agreement?.url && (
                <a
                  href={agreement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...BTN_BASE, background: 'var(--brand-primary)', color: '#fff' }}
                >
                  View
                </a>
              )}

              {editing && (
                <label
                  className="bill-file-btn"
                  style={{
                    ...BTN_BASE,
                    background: '#fff',
                    color: 'var(--brand-primary)',
                    border: '1.5px solid var(--brand-primary)',
                    ...(uploading ? { pointerEvents: 'none', opacity: 0.6 } : {}),
                  }}
                >
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" hidden onChange={onPick} disabled={uploading} />
                  {uploading ? 'Uploading…' : '📎 Choose File'}
                </label>
              )}
            </div>
            {agreement && <div className="bill-file-name">{agreement.name}</div>}
            {uploadErr && <div className="sett-error" role="alert" style={{ marginTop: 8 }}>{uploadErr}</div>}
            {uploadOk && <div className="sett-ok" role="status" style={{ marginTop: 8 }}>✓ Agreement uploaded.</div>}
          </section>
        </>
      )}
    </>
  );
}
