/**
 * Uppercase-label form field used throughout the Add Employee wizard.
 * Children render the actual control (input/select/etc.) so the same
 * wrapper handles all input types.
 */
export default function AeField({ label, required = false, hint, children }) {
  return (
    <div className="ae-field">
      <label>
        {label}
        {required && <span className="req"> *</span>}
        {hint && <span className="ae-field-hint"> {hint}</span>}
      </label>
      {children}
    </div>
  );
}
