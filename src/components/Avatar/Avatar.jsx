import './Avatar.css';

/** Circular initials avatar. */
export default function Avatar({ initials = '', color, size = 34, className = '' }) {
  const style = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.36),
    background: color || 'var(--brand-primary)',
  };
  return (
    <span className={`avatar ${className}`} style={style} aria-hidden="true">
      {initials}
    </span>
  );
}
