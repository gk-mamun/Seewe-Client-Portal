/**
 * Wraps the .info-grid + .info-item structure into a friendly component.
 *   <InfoGrid items={[{ label: 'Email', value: 'a@b.com' }, ...]} />
 */
export default function InfoGrid({ items }) {
  return (
    <div className="info-grid">
      {items.map((it) => (
        <div key={it.label} className="info-item">
          <div className="lbl">{it.label}</div>
          <div className="val">{it.value || '—'}</div>
        </div>
      ))}
    </div>
  );
}
