import InfoGrid from '../../../components/InfoGrid/InfoGrid.jsx';

export default function InfoTab({ employee }) {
  const personal = [
    { label: 'Email',        value: employee.email },
    { label: 'Phone',        value: employee.phone },
    { label: 'IC / NRIC',    value: employee.ic },
    { label: 'Passport',     value: employee.passport },
    { label: 'Date of Birth',value: employee.dob },
    { label: 'Nationality',  value: employee.nationality },
    { label: 'Gender',       value: employee.gender },
    { label: 'Address',      value: employee.addr },
  ];
  const employment = [
    { label: 'Start Date', value: employee.startDate },
    { label: 'Contract',   value: employee.contract },
    { label: 'Probation',  value: employee.probation },
    { label: 'Reports To', value: employee.reportTo },
    { label: 'Department', value: employee.dept },
    { label: 'Status',     value: employee.status },
  ];
  const schedule = [
    { label: 'Work Days',   value: employee.workDays },
    { label: 'Start',       value: employee.workStart },
    { label: 'End',         value: employee.workEnd },
    { label: 'Timezone',    value: employee.timezone },
    { label: 'Arrangement', value: employee.arrangement },
    { label: 'Break Time',  value: employee.breakTime },
  ];
  const bank = employee.bank || {};
  const bankItems = [
    { label: 'Bank',         value: bank.name },
    { label: 'Account Name', value: bank.accountName },
    { label: 'Account No.',  value: bank.accountNo },
    { label: 'Branch',       value: bank.branch },
    { label: 'SWIFT',        value: bank.swift },
  ];
  const hasBank = bankItems.some((i) => i.value);

  return (
    <>
      <div className="section-hd">Personal</div>
      <InfoGrid items={personal} />
      <div className="section-hd">Employment</div>
      <InfoGrid items={employment} />
      <div className="section-hd">Working Schedule</div>
      <InfoGrid items={schedule} />
      {hasBank && (
        <>
          <div className="section-hd">Bank Details</div>
          <InfoGrid items={bankItems} />
        </>
      )}
    </>
  );
}
