import SalaryBreakdown from '../../../components/SalaryBreakdown/SalaryBreakdown.jsx';
import DataTable from '../../../components/DataTable/DataTable.jsx';
import { formatHKD } from '../../../utils/format.js';

export default function SalaryTab({ employee }) {
  const breakdown = [
    { label: 'Base',      value: employee.base },
    { label: 'Housing',   value: employee.housing },
    { label: 'Transport', value: employee.transport },
    { label: 'MPF',       value: employee.mpf },
    { label: 'EOR Fee',   value: employee.eor },
    { label: 'Total',     value: employee.total, isTotal: true },
  ];

  // Sample payroll history — would come from API in production
  const history = [
    { month: 'May 2026', base: employee.base, allowance: (employee.housing || 0) + (employee.transport || 0), deduction: employee.mpf, net: employee.total },
    { month: 'Apr 2026', base: employee.base, allowance: (employee.housing || 0) + (employee.transport || 0), deduction: employee.mpf, net: employee.total },
  ];

  const cols = [
    { key: 'month',     header: 'Month' },
    { key: 'base',      header: 'Base',      render: (r) => formatHKD(r.base) },
    { key: 'allowance', header: 'Allowance', render: (r) => formatHKD(r.allowance) },
    { key: 'deduction', header: 'Deduction', render: (r) => formatHKD(r.deduction) },
    { key: 'net',       header: 'Net Pay',   render: (r) => formatHKD(r.net) },
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
