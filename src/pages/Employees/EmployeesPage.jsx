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
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { ROUTES } from '../../utils/constants.js';
import { formatHKD } from '../../utils/format.js';
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2025-02-01" → "Feb 1, 2025"; blank / "0000-00-00" → "". */
const fmtDate = (v) => {
  const [y, m, d] = String(v || '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : '';
};

const ProbationCell = ({ value }) => {
  if (value === 'Completed') {
    return <span style={{ color: 'var(--c-success)', fontWeight: 600 }}>✓ Completed</span>;
  }
  if (value === 'In Progress') {
    return <span style={{ color: 'var(--c-warning)', fontWeight: 600 }}>⏳ In Progress</span>;
  }
  return '—';
};

export default function EmployeesPage() {
  useDocumentTitle('Employees');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
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
    filters: { status },
    searchFields: ['name', 'email', 'pos'],
  });

  const columns = [
    {
      key: 'name',
      header: 'Employee',
      render: (r) => (
        <Link to={`/employees/${r.id}`} className="emp-cell">
          <Avatar initials={r.initials} color={r.color} photo={r.photo} alt={r.name} size={32} />
          <div>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-soft)' }}>{r.email}</div>
          </div>
        </Link>
      ),
    },
    { key: 'pos', header: 'Position' },
    {
      key: 'contractPeriod',
      header: 'Contract Period',
      render: (r) =>
        r.contractPeriod
          ? <Badge tone={/contract/i.test(r.contractPeriod) ? 'blu' : 'grn'}>{r.contractPeriod}</Badge>
          : '—',
    },
    { key: 'baseSalary', header: 'Base Salary', render: (r) => formatHKD(r.baseSalary) },
    { key: 'allowance',  header: 'Allowance',   render: (r) => formatHKD(r.allowance) },
    { key: 'mpf',        header: 'Employer MPF (Est)', render: (r) => formatHKD(r.mpf) },
    { key: 'joinDate',   header: 'Join Date',   render: (r) => fmtDate(r.joinDate) || '—' },
    { key: 'probation',  header: 'Probation',   render: (r) => <ProbationCell value={r.probation} /> },
    { key: 'lastDay',    header: 'Last Day',    render: (r) => fmtDate(r.lastDay) || '—' },
    { key: 'status',     header: 'Status',      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'gry'}>{r.status}</Badge> },
    {
      key: 'actions',
      header: 'Action',
      render: (r) => (
        <Link to={`/employees/${r.id}`} className="btn bol">View →</Link>
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
          placeholder="Search name, position, department…"
          filters={[
            { name: 'status', value: status, options: EMP_STATUSES, onChange: setStatus, label: 'Status' },
          ]}
          count={`${filtered.length} / ${items.length}`}
          onClear={() => { setSearch(''); setStatus('All'); }}
        />

        {loading ? (
          <div style={{ padding: 24, color: 'var(--c-text-soft)' }}>Loading employees…</div>
        ) : error ? (
          <div style={{ padding: 24, color: 'var(--c-danger)' }}>{error}</div>
        ) : (
          <>
            <div className="emp-desk-table">
              <DataTable columns={columns} rows={filtered} emptyText="No employees match the filters." landscape />
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
