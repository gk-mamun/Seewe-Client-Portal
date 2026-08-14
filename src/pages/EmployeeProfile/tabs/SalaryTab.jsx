import SalaryBreakdown from '../../../components/SalaryBreakdown/SalaryBreakdown.jsx';
import DataTable from '../../../components/DataTable/DataTable.jsx';
import { formatMYR } from '../../../utils/format.js';

export default function SalaryTab({ employee }) {
  const emp = employee.employmentDetail || {};
  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const base = toNum(employee.base);
  const allowance = toNum(emp.allowance_1 ?? emp.allowance ?? employee.allowance);
  const mpf = Math.min(Math.round(base * 0.05), 1500); // employer MPF est: 5%, capped at 1,500
  const total = base + allowance + mpf;
  const breakdown = [
    { label: 'Base Salary',           value: base },
    { label: 'Allowance',             value: allowance },
    { label: 'Employer MPF (Est 5%)', value: mpf },
    { label: 'Total',                 value: total, isTotal: true },
  ];

  // Sample payroll history — would come from API in production
  const history = [
    { month: 'May 2026', base: employee.base, allowance: (employee.housing || 0) + (employee.transport || 0), deduction: employee.mpf, net: employee.total },
    { month: 'Apr 2026', base: employee.base, allowance: (employee.housing || 0) + (employee.transport || 0), deduction: employee.mpf, net: employee.total },
  ];

  const cols = [
    { key: 'month',     header: 'Month' },
    { key: 'base',      header: 'Base',      render: (r) => formatMYR(r.base) },
    { key: 'allowance', header: 'Allowance', render: (r) => formatMYR(r.allowance) },
    { key: 'deduction', header: 'Deduction', render: (r) => formatMYR(r.deduction) },
    { key: 'net',       header: 'Net Pay',   render: (r) => formatMYR(r.net) },
  ];

  return (
    <>
      <div className="section-hd">Salary Breakdown</div>
      <SalaryBreakdown items={breakdown} />
      <div className="section-hd">Payroll History</div>
      <DataTable columns={cols} rows={history} landscape getRowKey={(r) => r.month} />
    </>
  );
}
