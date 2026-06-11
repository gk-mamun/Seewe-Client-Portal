export default function ReviewStep({ data }) {
  const sections = [
    { title: 'Company',  rows: [['Name', data.companyName], ['Country', data.country], ['Industry', data.industry]] },
    { title: 'Contacts', rows: [['HR', data.hrName],        ['HR Email', data.hrEmail], ['Finance', data.finName]] },
    { title: 'Billing',  rows: [['Cycle', data.cycle],      ['Method', data.method],    ['Invoice email', data.invEmail]] },
  ];

  return (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>Review &amp; Confirm</h2>
      <p style={{ fontSize: 13, color: 'var(--c-text-soft)', marginBottom: 28 }}>
        Double-check the details below before activating your portal.
      </p>
      {sections.map((s) => (
        <section key={s.title} className="ob-review-section">
          <h4>{s.title}</h4>
          {s.rows.map(([lbl, val]) => (
            <div key={lbl} className="ob-review-row">
              <span className="ob-review-lbl">{lbl}</span>
              <span className="ob-review-val">{val || '—'}</span>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
