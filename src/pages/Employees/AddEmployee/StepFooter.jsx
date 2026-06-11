import Button from '../../../components/Button/Button.jsx';
import './StepFooter.css';

/**
 * Sticky footer row at the bottom of each step.
 *   • Step 1 → Cancel | Save Draft   /   Continue →
 *   • Step 2-4 → ← Back | Save Draft  /   Continue →
 *   • Step 5 → ← Back | Save Draft   /   ✓ Save & Create Employee
 */
export default function StepFooter({
  isFirst,
  isLast,
  onCancel,
  onBack,
  onSaveDraft,
  onContinue,
  onSubmit,
}) {
  return (
    <footer className="ae-footer">
      <div className="ae-footer-left">
        {isFirst ? (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        ) : (
          <Button variant="outline" onClick={onBack}>← Back</Button>
        )}
        <button type="button" className="btn ae-save-draft" onClick={onSaveDraft}>
          📋 Save Draft
        </button>
      </div>
      {isLast ? (
        <Button variant="success" onClick={onSubmit}>✓ Save &amp; Create Employee</Button>
      ) : (
        <Button onClick={onContinue}>Continue →</Button>
      )}
    </footer>
  );
}
