import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar.jsx';
import Badge from '../Badge/Badge.jsx';
import './EmployeeCard.css';

const STATUS_TONE = {
  Active: 'grn',
  'Probation Period': 'pur',
  'Going Onboard': 'blu',
  'Notice Period': 'amb',
  'Ex-employee': 'red',
  Terminated: 'red',
  Inactive: 'gry',
};

/** Card view of an employee — used in mobile lists and as a fallback view. */
export default function EmployeeCard({ employee }) {
  return (
    <Link to={`/employees/${employee.id}`} className="emp-mob-card">
      <Avatar
        initials={employee.initials}
        color={employee.color}
        photo={employee.photo}
        alt={employee.name}
        size={52}
        className="emp-mob-av"
      />
      <div className="emp-mob-info">
        <div className="emp-mob-name">{employee.name}</div>
        <div className="emp-mob-pos">{employee.pos}</div>
        <div className="emp-mob-dept">
          <Badge tone={STATUS_TONE[employee.status] || 'gry'}>{employee.status}</Badge>
        </div>
      </div>
    </Link>
  );
}
