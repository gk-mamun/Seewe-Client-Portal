import './DepartmentsTab.css';

const DEPTS = [
  { name: 'Technology', head: 'Alice Chan' },
  { name: 'Design',     head: 'Brian Lee' },
  { name: 'Operations', head: 'Carol Ng' },
  { name: 'Sales',      head: 'David Tan' },
];

export default function DepartmentsTab() {
  return (
    <div className="dept-grid">
      {DEPTS.map((d) => (
        <div key={d.name} className="dept-card">
          <div className="dept-name">{d.name}</div>
          <input defaultValue={d.head} aria-label={`${d.name} head`} />
        </div>
      ))}
    </div>
  );
}
