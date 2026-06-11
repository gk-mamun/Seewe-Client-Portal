import { useEffect, useRef, useState } from 'react';
import './reports-to-picker.css';

/**
 * Multi-select dropdown showing employee name + position + department.
 * Click the chip area to open, click outside to close.
 */
export default function ReportsToPicker({ people, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const toggle = (name) => {
    const next = selected.includes(name)
      ? selected.filter((n) => n !== name)
      : [...selected, name];
    onChange(next);
  };

  return (
    <div className="rt-picker" ref={rootRef}>
      <div
        className="rt-display"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
      >
        {selected.length === 0 ? (
          <span className="rt-placeholder">Select one or more people…</span>
        ) : (
          selected.map((n) => <span key={n} className="rt-chip">{n}</span>)
        )}
        <span className="rt-caret">▾</span>
      </div>
      {open && (
        <div className="rt-dropdown">
          {people.map((p) => (
            <label key={p.id} className="rt-option">
              <input
                type="checkbox"
                checked={selected.includes(p.name)}
                onChange={() => toggle(p.name)}
              />
              <div>
                <div className="rt-option-name">{p.name}</div>
                <div className="rt-option-meta">{p.pos} · {p.dept}</div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
