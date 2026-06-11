import LeaveBalanceCard, {
  LeaveBalanceGrid,
} from '../../../components/LeaveBalanceCard/LeaveBalanceCard.jsx';

const LABELS = {
  annual: 'Annual',
  medical: 'Medical',
  emergency: 'Emergency',
  hospitalization: 'Hospitalization',
};

export default function LeaveTab({ employee }) {
  const balances = employee.leave || {};
  return (
    <>
      <div className="section-hd">Leave Balances</div>
      <LeaveBalanceGrid>
        {Object.entries(balances).map(([key, val]) => (
          <LeaveBalanceCard
            key={key}
            type={LABELS[key] || key}
            used={val.used}
            total={val.total}
          />
        ))}
      </LeaveBalanceGrid>
    </>
  );
}
