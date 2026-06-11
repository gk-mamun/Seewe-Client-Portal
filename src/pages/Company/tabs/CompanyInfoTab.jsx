import { useEffect, useState } from 'react';
import CountrySelect from '../../../components/CountrySelect/CountrySelect.jsx';
import UploadBox from '../../../components/UploadBox/UploadBox.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

const INDUSTRIES = [
  'Technology / IT', 'Software & SaaS', 'Finance & Banking', 'Insurance',
  'Accounting & Audit', 'Retail & E-Commerce', 'F&B & Hospitality',
  'Healthcare & Medical', 'Education & Training', 'Manufacturing & Industrial',
  'Logistics & Supply Chain', 'Construction & Real Estate',
  'Marketing & Advertising', 'Consulting & Professional Services',
  'Recruitment / HR', 'Media & Entertainment', 'Non-Profit / NGO',
  'Government / Public Sector', 'Others',
];

const CONTACT_PREFS = ['WhatsApp', 'Email', 'Both'];

export default function CompanyInfoTab() {
  const { client, updateClient } = useAuth();

  // Prefill from the logged-in client; falls back to blanks so the inputs
  // are always controlled.
  const [company, setCompany] = useState(() => ({
    name:            client?.company_name    || '',
    brn:             client?.brn             || '',
    industry:        client?.industry        || 'Technology / IT',
    yearEstablished: client?.year_established || '',
    employees:       client?.employees       || '',
    website:         client?.website         || '',
    address:         client?.company_address || '',
    country:         client?.country         || '',
    intro:           client?.intro           || '',
  }));
  const [contact, setContact] = useState(() => ({
    name:      client?.contact_name  || '',
    title:     client?.contact_title || '',
    officeNum: client?.office_number || '',
    mobile:    client?.mobile        || '',
    email:     client?.email         || '',
    pref:      client?.contact_pref  || 'Both',
    location:  client?.contact_location || client?.country || '',
  }));

  // Reflect changes back into the cached client object so the route
  // guard re-evaluates whenever the required fields are filled in.
  useEffect(() => {
    if (!client) return;
    const patch = {
      company_name:    company.name,
      company_address: company.address,
      country:         company.country,
      email:           contact.email,
    };
    const changed = Object.entries(patch).some(
      ([k, v]) => String(client[k] ?? '').trim() !== String(v ?? '').trim()
    );
    if (changed) updateClient(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.name, company.address, company.country, contact.email]);

  const [brFile, setBrFile] = useState({ name: 'BR_Certificate_BrightenTech_2026.pdf', verified: true });

  const setC = (patch) => setCompany((c) => ({ ...c, ...patch }));
  const setX = (patch) => setContact((c) => ({ ...c, ...patch }));

  return (
    <>
      <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
        {/* ── Company Details ── */}
        <section className="sett-panel">
          <h3 className="section-hd">Company Details</h3>

          <div className="field-block">
            <label className="tiny-label">Company Name (same as business registration) *</label>
            <input className="tiny-input" value={company.name} onChange={(e) => setC({ name: e.target.value })} />
          </div>
          <div className="field-block">
            <label className="tiny-label">Business Registration Number</label>
            <input className="tiny-input" value={company.brn} onChange={(e) => setC({ brn: e.target.value })} placeholder="e.g. 12345678-A" />
          </div>
          <div className="field-block">
            <label className="tiny-label">Industry</label>
            <select className="tiny-select" value={company.industry} onChange={(e) => setC({ industry: e.target.value })}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="field-block">
              <label className="tiny-label">Year Established</label>
              <input className="tiny-input" placeholder="e.g. 2018"
                value={company.yearEstablished} onChange={(e) => setC({ yearEstablished: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">No. of Employees</label>
              <input className="tiny-input" placeholder="e.g. 25"
                value={company.employees} onChange={(e) => setC({ employees: e.target.value })} />
            </div>
          </div>
          <div className="field-block">
            <label className="tiny-label">Company Website</label>
            <input className="tiny-input" placeholder="https://www.yourcompany.com"
              value={company.website} onChange={(e) => setC({ website: e.target.value })} />
          </div>
          <div className="grid-2">
            <div className="field-block">
              <label className="tiny-label">Office Address</label>
              <input className="tiny-input" value={company.address} onChange={(e) => setC({ address: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">Country</label>
              <CountrySelect className="tiny-select" value={company.country} onChange={(v) => setC({ country: v })} />
            </div>
          </div>
          <div className="field-block" style={{ marginBottom: 0 }}>
            <label className="tiny-label">
              Company Introduction <span style={{ fontWeight: 400, color: 'var(--c-text-fade)' }}>(optional)</span>
            </label>
            <textarea
              className="tiny-input"
              style={{ minHeight: 60, resize: 'vertical' }}
              placeholder="We kindly request a brief introduction about your company, which we can share with the candidate to ensure they are matched with a placement that best meets your hiring requirements."
              value={company.intro}
              onChange={(e) => setC({ intro: e.target.value })}
            />
          </div>
        </section>

        {/* ── Primary Contact ── */}
        <section className="sett-panel accent">
          <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--brand-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)' }}>Primary Contact</div>
            <div style={{ fontSize: 10, color: 'var(--c-text-soft)', fontStyle: 'italic', marginTop: 2 }}>
              Direct contact for hiring preference — can be updated after saving
            </div>
          </div>

          <div className="grid-2">
            <div className="field-block">
              <label className="tiny-label">Contact Name *</label>
              <input className="tiny-input" value={contact.name} onChange={(e) => setX({ name: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">Job Title</label>
              <input className="tiny-input" placeholder="e.g. HR Manager"
                value={contact.title} onChange={(e) => setX({ title: e.target.value })} />
            </div>
          </div>
          <div className="grid-2">
            <div className="field-block">
              <label className="tiny-label">Office Number</label>
              <input className="tiny-input" value={contact.officeNum} onChange={(e) => setX({ officeNum: e.target.value })} />
            </div>
            <div className="field-block">
              <label className="tiny-label">Mobile / WhatsApp *</label>
              <input className="tiny-input" value={contact.mobile} onChange={(e) => setX({ mobile: e.target.value })} />
            </div>
          </div>
          <div className="field-block">
            <label className="tiny-label">Contact Email *</label>
            <input className="tiny-input" type="email" value={contact.email} onChange={(e) => setX({ email: e.target.value })} />
          </div>
          <div className="grid-2">
            <div className="field-block">
              <label className="tiny-label">Contact Preference</label>
              <select className="tiny-select" value={contact.pref} onChange={(e) => setX({ pref: e.target.value })}>
                {CONTACT_PREFS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="field-block">
              <label className="tiny-label">Your Location (Country)</label>
              <CountrySelect className="tiny-select" value={contact.location} onChange={(v) => setX({ location: v })} />
            </div>
          </div>
        </section>
      </div>

      {/* ── BR Certificate ── */}
      <section className="sett-panel">
        <h3 className="section-hd">Business Registration Certificate</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <UploadBox
              label="Click to upload BR Certificate"
              hint="PDF, JPG, PNG — max 10MB"
              maxMB={10}
              onFile={(f) => f && setBrFile({ name: f.name, verified: false })}
            />
          </div>
          {brFile && (
            <div style={{
              flex: 2, minWidth: 240,
              background: '#fff', border: '1px solid var(--c-border)',
              borderRadius: 8, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }} aria-hidden="true">📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{brFile.name}</div>
                <div style={{ fontSize: 11, color: 'var(--c-success)', fontWeight: 600 }}>
                  {brFile.verified ? '✓ Verified' : 'Pending verification'}
                </div>
              </div>
              <button type="button" className="btn bol" style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => setBrFile(null)}>✕</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
