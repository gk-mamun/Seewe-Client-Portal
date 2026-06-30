import './Avatar.css';

/** Circular avatar — shows a photo when provided, otherwise initials. */
export default function Avatar({ initials = '', color, size = 34, className = '', photo, alt = '' }) {
  if (photo) {
    return (
      <img
        className={`avatar ${className}`}
        src={photo}
        alt={alt}
        style={{ width: size, height: size, objectFit: 'cover' }}
      />
    );
  }
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
