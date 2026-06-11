/**
 * Form field wrapper. Pass any of {input | select | textarea} props or `as` prop.
 *
 *   <FormField label="Email" name="email" value={v} onChange={...} placeholder="..." />
 *   <FormField label="Bio"   as="textarea" rows={3} ... />
 *   <FormField label="Dept"  as="select" options={['A','B']} ... />
 */
export default function FormField({
  label,
  name,
  as = 'input',
  options,
  required = false,
  className = '',
  ...rest
}) {
  let control;
  if (as === 'textarea') {
    control = <textarea id={name} name={name} {...rest} />;
  } else if (as === 'select') {
    control = (
      <select id={name} name={name} {...rest}>
        {options?.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
    );
  } else {
    control = <input id={name} name={name} {...rest} />;
  }

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span style={{ color: 'var(--c-danger)' }}> *</span>}
        </label>
      )}
      {control}
    </div>
  );
}
