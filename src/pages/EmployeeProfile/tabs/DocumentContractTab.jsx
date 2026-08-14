import { assetUrl } from '../../../config/api.js';
import './DocumentContractTab.css';

/* Each document is a single file column on user_employment_detail. */
const EMPLOYMENT_DOCS = [
  { key: 'letter_offer',        label: 'Offer / Appointment Letter', icon: '📋', color: '#1e40af', tint: '#eff6ff' },
  { key: 'confirmation_letter', label: 'Confirmation Letter',        icon: '✅', color: '#166534', tint: '#ecfdf5' },
  { key: 'promotion_letter',    label: 'Promotion Letter',           icon: '📈', color: '#7e22ce', tint: '#f5f3ff' },
  { key: 'certificate',         label: 'Certificate',                icon: '📜', color: '#0e7490', tint: '#ecfeff' },
];

const CONTRACT_DOCS = [
  { key: 'client_agreement',   label: 'Client Agreement',   icon: '📄', color: '#c2410c', tint: '#fff7ed' },
  { key: 'resignation_letter', label: 'Resignation Letter', icon: '📝', color: '#b91c1c', tint: '#fef2f2' },
  { key: 'termination_letter', label: 'Termination Letter', icon: '⛔', color: '#7c3aed', tint: '#faf5ff' },
];

function DocCard({ def, file }) {
  const has = file && String(file).trim() && !String(file).startsWith('0000');
  const href = has ? assetUrl(file) : '';
  const name = has ? String(file).split('/').pop() : '';
  return (
    <section className="doc-card">
      <header className="doc-card-hd" style={{ background: def.tint }}>
        <span className="doc-card-title" style={{ color: def.color }}>
          <span aria-hidden="true">{def.icon}</span> {def.label}
        </span>
      </header>
      <div className="doc-body">
        {has ? (
          <div className="doc-file" style={{ borderColor: def.color, background: def.tint }}>
            <div className="doc-file-name" title={name}>📄 {name}</div>
            <a className="doc-view" href={href} target="_blank" rel="noopener noreferrer">⇩ View</a>
          </div>
        ) : (
          <div className="doc-upload">⬆ Upload</div>
        )}
      </div>
    </section>
  );
}

export default function DocumentContractTab({ employee }) {
  const emp = employee?.employmentDetail || {};
  return (
    <>
      <div className="section-hd">Employment Documents</div>
      <p className="doc-section-sub">Offer, confirmation and promotion letters, and certificates.</p>
      <div className="doc-grid">
        {EMPLOYMENT_DOCS.map((def) => <DocCard key={def.key} def={def} file={emp[def.key]} />)}
      </div>

      <div className="section-hd">Contract &amp; Exit Documents</div>
      <p className="doc-section-sub">Client agreement, resignation and termination letters.</p>
      <div className="doc-grid">
        {CONTRACT_DOCS.map((def) => <DocCard key={def.key} def={def} file={emp[def.key]} />)}
      </div>

      <div className="doc-note">
        📌 Accepted: PDF, JPG, PNG. Securely stored. Contact your SeeWe Work account manager for corrections.
      </div>
    </>
  );
}
