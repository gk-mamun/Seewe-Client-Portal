const TONE_CLASS = { red: 'alert-red', amber: 'alert-amb', green: 'alert-grn', blue: 'alert-blu' };
const TONE_ICON  = { red: '⚠', amber: '⚠', green: '✓', blue: 'ℹ' };

export default function Alert({ tone = 'blue', title, children, action }) {
  return (
    <div className={`alert ${TONE_CLASS[tone]}`} role={tone === 'red' ? 'alert' : 'status'}>
      <span className="alert-ico" aria-hidden="true">{TONE_ICON[tone]}</span>
      <div className="alert-body">
        {title && <strong>{title}</strong>}
        {children}
      </div>
      {action}
    </div>
  );
}
