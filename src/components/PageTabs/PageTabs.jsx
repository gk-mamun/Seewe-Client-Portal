import './PageTabs.css';

/**
 * Horizontal tab strip used inside cards and pages.
 *   <PageTabs tabs={[{key:'a', label:'A'}]} active="a" onChange={fn} />
 */
export default function PageTabs({ tabs, active, onChange }) {
  return (
    <div className="page-tab-row" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          className={`page-tab ${active === t.key ? 'on' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
