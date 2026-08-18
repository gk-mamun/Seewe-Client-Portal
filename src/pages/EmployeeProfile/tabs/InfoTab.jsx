import InfoGrid from '../../../components/InfoGrid/InfoGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';

/** Title-case a value (female → Female, "malaysia chinese" → "Malaysia Chinese"). */
const cap = (v) =>
  v ? String(v).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : v;

const fileLink = (href) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
      View
    </a>
  ) : '';

const TH = { textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 700 };
const TD = { padding: '12px 16px', fontSize: 13, verticalAlign: 'middle' };

function WorkingWeek({ data }) {
  const { timezone, breakTime, arrangement, days = [] } = data || {};
  return (
    <>
      <div className="section-hd">Working Date &amp; Time</div>
      <InfoGrid
        items={[
          { label: 'Time Zone', value: timezone },
          { label: 'Break Time', value: breakTime },
          { label: 'Work Arrangement', value: arrangement ? <Badge tone="grn">{arrangement}</Badge> : '' },
        ]}
      />
      <div style={{ border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginTop: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--brand-primary-dark)', color: '#fff' }}>
              <th style={TH}>Day</th>
              <th style={TH}>Start</th>
              <th style={TH}>End</th>
              <th style={TH}>Location / Arrangement</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr
                key={d.label}
                style={{
                  borderTop: '1px solid var(--c-border-soft)',
                  background: d.off ? 'var(--c-surface-mute)' : (i % 2 ? '#fafafa' : '#fff'),
                }}
              >
                <td style={TD}>
                  <strong style={{ color: d.off ? 'var(--c-text-fade)' : 'var(--brand-primary-dark)' }}>{d.label}</strong>
                </td>
                {d.off ? (
                  <>
                    <td style={TD}><Badge tone="gry">Off Day</Badge></td>
                    <td style={TD} />
                    <td style={TD} />
                  </>
                ) : (
                  <>
                    <td style={TD}><strong>{d.start || '—'}</strong></td>
                    <td style={TD}><strong>{d.end || '—'}</strong></td>
                    <td style={TD}>{d.arrangement ? <Badge tone="grn">{d.arrangement}</Badge> : '—'}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function InfoTab({ employee }) {
  const personal = [
    { label: 'First Name',                value: employee.firstName },
    { label: 'Last Name',                 value: employee.lastName },
    { label: 'Display Name',              value: employee.otherName },
    { label: 'Name (Chinese)',            value: employee.nameInChinese },
    { label: 'Gender',                    value: cap(employee.gender) },
    { label: 'Phone',                     value: employee.phone },
    { label: 'Nationality',               value: cap(employee.nationality) },
    { label: 'Email',                     value: employee.email },
    { label: 'Date of Birth',             value: employee.dob },
    { label: 'Address',                   value: employee.addr },
    { spacer: true },
    { label: 'Designated Holiday Country',value: cap(employee.holidayCountry) },
  ];
  const employment = [
    { label: 'Joined Date',            value: employee.startDate },
    { label: 'Probation End Date',     value: employee.probation },
    { label: 'Contract Type',          value: cap(employee.contract) },
    { label: 'Reports To',             value: employee.reportTo },
    { label: 'Notice / Resign Period', value: employee.noticePeriod },
    { label: 'Last Day / Contract End',value: employee.lastDay },
    { label: 'Resignation Letter',     value: fileLink(employee.resignationLetter) },
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
      <div className="section-hd">Personal Details</div>
      <InfoGrid items={personal} />
      <div className="section-hd">Employment</div>
      <InfoGrid items={employment} />
      <WorkingWeek data={employee.workingWeek} />
      {hasBank && (
        <>
          <div className="section-hd">Bank Details</div>
          <InfoGrid items={bankItems} />
        </>
      )}
    </>
  );
}
