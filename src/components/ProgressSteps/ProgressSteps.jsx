import './ProgressSteps.css';

/**
 * Multi-step indicator used by the onboarding wizard.
 *   <ProgressSteps steps={['A','B','C']} current={2} />
 */
export default function ProgressSteps({ steps, current }) {
  const pct = ((current) / steps.length) * 100;
  return (
    <>
      <div className="ob-prog-bar">
        <div className="ob-prog-fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="ob-steps">
        {steps.map((name, i) => {
          const idx = i + 1;
          const state = idx < current ? 'done' : idx === current ? 'curr' : '';
          return (
            <li key={name} className={`ob-st ${state}`}>
              <span className="ob-st-dot">{idx < current ? '✓' : idx}</span>
              <span className="ob-st-name">{name}</span>
            </li>
          );
        })}
      </ol>
    </>
  );
}
