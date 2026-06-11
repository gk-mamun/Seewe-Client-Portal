import './documents.css';

const DOC_TYPES = [
  { key: 'appt',  lbl: 'Appointment Letter',     icon: '📋', tone: 'blue' },
  { key: 'conf',  lbl: 'Confirmation Letter',    icon: '✅', tone: 'green' },
  { key: 'renew', lbl: 'Service Renewal Letter', icon: '🔄', tone: 'purple' },
];

const YEARS = ['2023', '2024', '2025', '2026'];

export default function DocumentsStep({ draft, set }) {
  const docs = draft.docs || {};

  const onUpload = (typeKey, year, file) => {
    if (!file) return;
    set({
      docs: {
        ...docs,
        [typeKey]: { ...(docs[typeKey] || {}), [year]: file.name },
      },
    });
  };

  return (
    <>
      <h2 className="ae-section">Documents</h2>
      <p className="ae-sub">Upload employment letters by year. You can add more after the employee is created.</p>

      {DOC_TYPES.map((dt) => (
        <section key={dt.key} className={`docs-panel docs-panel--${dt.tone}`}>
          <header>
            <span aria-hidden="true">{dt.icon}</span>
            <span>{dt.lbl}</span>
          </header>
          <div className="docs-years">
            {YEARS.map((yr) => {
              const fname = docs[dt.key]?.[yr];
              return (
                <div key={yr} className="docs-year-cell">
                  <div className="docs-year-lbl">{yr}</div>
                  <label className="docs-upload">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      hidden
                      onChange={(e) => onUpload(dt.key, yr, e.target.files?.[0])}
                    />
                    <span className="docs-upload-pill">⇧ Upload</span>
                  </label>
                  {fname && <div className="docs-ready">✓ {fname}</div>}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="ae-note ae-note--amber">
        📌 Accepted formats: PDF, JPG, PNG. All documents are securely stored and accessible in the employee profile.
      </div>
    </>
  );
}
