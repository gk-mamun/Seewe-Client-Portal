import './Card.css';

/** Generic surface used everywhere a section needs a white panel. */
export default function Card({ title, actions, children, className = '', bodyPadding = true }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="card-hd">
          {title && <h3>{title}</h3>}
          {actions}
        </header>
      )}
      <div className={bodyPadding ? 'card-body' : ''}>{children}</div>
    </section>
  );
}
