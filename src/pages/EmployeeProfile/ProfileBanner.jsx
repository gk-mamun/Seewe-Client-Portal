import './ProfileBanner.css';

export default function ProfileBanner({ employee }) {
  return (
    <div className="prof-banner">
      {employee.photo ? (
        <img
          className="prof-av"
          src={employee.photo}
          alt={employee.name}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div
          className="prof-av"
          style={{ background: employee.color || 'var(--brand-primary)' }}
          aria-hidden="true"
        >
          {employee.initials}
        </div>
      )}
      <div className="prof-info">
        <div className="prof-name">{employee.name}</div>
        <div className="prof-role">{employee.pos} · {employee.dept}</div>
      </div>
    </div>
  );
}
