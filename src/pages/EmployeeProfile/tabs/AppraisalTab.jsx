import Card from '../../../components/Card/Card.jsx';

const SAMPLE_APPRAISALS = [
  { period: 'Q1 2026 (Jan–Mar)', date: 'Apr 5, 2026', reviewer: 'Carol Ng', overall: 4.2, status: 'Completed', increment: 'HKD +2,000' },
  { period: 'Probation Review',  date: 'Aug 1, 2025', reviewer: 'Carol Ng', overall: 3.9, status: 'Completed', increment: '—' },
];

export default function AppraisalTab() {
  return (
    <>
      <div className="section-hd">Appraisal History</div>
      {SAMPLE_APPRAISALS.map((a) => (
        <Card key={a.period} title={a.period} actions={<span className="ba grn">{a.status}</span>}>
          <div className="info-grid">
            <div className="info-item"><div className="lbl">Date</div><div className="val">{a.date}</div></div>
            <div className="info-item"><div className="lbl">Reviewer</div><div className="val">{a.reviewer}</div></div>
            <div className="info-item"><div className="lbl">Overall</div><div className="val">{a.overall} / 5</div></div>
            <div className="info-item"><div className="lbl">Increment</div><div className="val">{a.increment}</div></div>
          </div>
        </Card>
      ))}
    </>
  );
}
