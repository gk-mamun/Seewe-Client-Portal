/**
 * Thin wrapper over the .btn/.bdk/.bol/.bred/.bgrn utility classes so
 * we get consistent typing & a single place to add behaviours later
 * (loading state, icon prop, etc.).
 */
const VARIANT_CLASS = {
  primary: 'bdk',
  outline: 'bol',
  danger:  'bred',
  success: 'bgrn',
};

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button type={type} className={`btn ${VARIANT_CLASS[variant] || ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}
