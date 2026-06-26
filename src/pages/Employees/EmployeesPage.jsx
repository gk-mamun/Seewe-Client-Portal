import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import DataTable from '../../components/DataTable/DataTable.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import EmployeeCard from '../../components/EmployeeCard/EmployeeCard.jsx';
import { employeeService, EMP_STATUSES } from '../../services/employeeService.js';
import { DEPARTMENTS } from '../../data/employees.js';
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { ROUTES } from '../../utils/constants.js';
import './EmployeesPage.css';

const STATUS_TONE = {
  Active: 'grn',
  'Probation Period': 'pur',
  'Going Onboard': 'blu',
  'Notice Period': 'amb',
  'Ex-employee': 'red',
  Terminated: 'red',
  Inactive: 'gry',
};

export default function EmployeesPage() {
  useDocumentTitle('Employees');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dept, setDept]     = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    let alive = true;
    employeeService
      .list()
      .then((rows) => { if (alive) setItems(rows); })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load employees.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = useFilteredList(items, {
    search,
    filters: { dept, status },
    searchFields: ['name', 'email', 'pos'],
  });

  const columns = [
    {
      key: 'name',
      header: 'Employee',
      render: (r) => (
        <Link to={`/employees/${r.id}`} className="emp-cell">
          <Avatar initials={r.initials} color={r.color} size={32} />
          <div>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-soft)' }}>{r.email}</div>
          </div>
        </Link>
      ),
    },
    { key: 'pos',    header: 'Position' },
    { key: 'dept',   header: 'Department' },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <Link to={`/employees/${r.id}`} className="btn bol">View</Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Employees"
        actions={
          <Link to={ROUTES.EMPLOYEE_NEW}>
            <Button>+ Add Employee</Button>
          </Link>
        }
      />

      <Card bodyPadding={false}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search name, email, position…"
          filters={[
            { name: 'dept',   value: dept,   options: DEPARTMENTS,  onChange: setDept,   label: 'Dept' },
            { name: 'status', value: status, options: EMP_STATUSES, onChange: setStatus, label: 'Status' },
          ]}
          count={`${filtered.length} of ${items.length}`}
          onClear={() => { setSearch(''); setDept('All'); setStatus('All'); }}
        />

        {loading ? (
          <div style={{ padding: 24, color: 'var(--c-text-soft)' }}>Loading employees…</div>
        ) : error ? (
          <div style={{ padding: 24, color: 'var(--c-danger)' }}>{error}</div>
        ) : (
          <>
            <div className="emp-desk-table">
              <DataTable columns={columns} rows={filtered} emptyText="No employees match the filters." />
            </div>

            <div className="emp-mob-list">
              {filtered.map((e) => <EmployeeCard key={e.id} employee={e} />)}
            </div>
          </>
        )}
      </Card>
    </>
  );
}
