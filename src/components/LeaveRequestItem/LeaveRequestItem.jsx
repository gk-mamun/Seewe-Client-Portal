import Avatar from '../Avatar/Avatar.jsx';
import Badge from '../Badge/Badge.jsx';
import Button from '../Button/Button.jsx';
import './LeaveRequestItem.css';

const STATUS_TONE = { Pending: 'amb', Approved: 'grn', Rejected: 'red' };

export default function LeaveRequestItem({ request, onApprove, onReject }) {
  const isPending = request.status === 'Pending';
  return (
    <div className="leave-req-item">
      <Avatar initials={request.initials} color={request.color} photo={request.photo} alt={request.name} size={36} />
      <div className="leave-req-info">
        <div className="leave-req-name">{request.name}</div>
        <div className="leave-req-detail">
          {request.type} · {request.from} → {request.to} · {request.days} day(s)
        </div>
        <div className="leave-req-detail" style={{ marginTop: 4 }}>
          {request.reason}
        </div>
      </div>
      <div className="leave-req-actions">
        {isPending ? (
          <>
            <Button variant="success" onClick={() => onApprove(request.id)}>Approve</Button>
            <Button variant="danger"  onClick={() => onReject(request.id)}>Reject</Button>
          </>
        ) : (
          <Badge tone={STATUS_TONE[request.status]}>{request.status}</Badge>
        )}
      </div>
    </div>
  );
}
