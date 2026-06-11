import { useEffect } from 'react';
import './Modal.css';

/**
 * Lightweight modal. Renders only when `open`. Handles Escape, backdrop click,
 * and prevents body scroll while open.
 */
export default function Modal({ open, onClose, title, subtitle, children, actions }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sig-overlay open" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sig-box" onClick={(e) => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        {subtitle && <div className="sig-sub">{subtitle}</div>}
        {children}
        {actions && <div className="sig-actions">{actions}</div>}
      </div>
    </div>
  );
}
