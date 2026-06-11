import './StepperSidebar.css';

/**
 * Dark navy left panel showing the 5 wizard steps + progress bar.
 *   • Each step row is clickable (jump to a step the user has reached).
 *   • Active step gets the amber dot, completed steps get the green ✓.
 */
export default function StepperSidebar({ steps, current, onJump }) {
  const pct = Math.round(((current - 1) / steps.length) * 100);

  return (
    <aside className="ae-left">
      <div>
        <div className="ae-left-title">New Employee</div>
        <div className="ae-left-sub">Complete all steps to add</div>

        <div className="ae-prog"><div className="ae-prog-fill" style={{ width: `${pct}%` }} /></div>

        <ol className="ae-step-list">
          {steps.map((s) => {
            const state = s.n < current ? 'done' : s.n === current ? 'active' : '';
            const reachable = s.n <= current;
            return (
              <li key={s.n}
                  className={`ae-step-row ${state}`}
                  onClick={reachable ? () => onJump(s.n) : undefined}
                  role={reachable ? 'button' : undefined}
                  tabIndex={reachable ? 0 : -1}
              >
                <span className="ae-step-dot">{s.n < current ? '✓' : s.n}</span>
                <div>
                  <div className="ae-step-lbl">{s.lbl}</div>
                  <div className="ae-step-sub">{s.sub}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="ae-left-footer">Step {current} of {steps.length}</div>
    </aside>
  );
}
