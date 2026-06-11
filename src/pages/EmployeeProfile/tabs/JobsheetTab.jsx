import DataTable from '../../../components/DataTable/DataTable.jsx';

const TASKS = [
  { time: '09:00 – 10:30', task: 'Daily standup + sprint planning sync',  status: 'Done' },
  { time: '10:30 – 12:30', task: 'Implement leave-balance API endpoint',  status: 'Done' },
  { time: '14:00 – 16:30', task: 'Code review pull requests #142, #143', status: 'Done' },
  { time: '16:30 – 18:00', task: 'Documentation update for onboarding flow', status: 'In Progress' },
];

export default function JobsheetTab() {
  const cols = [
    { key: 'time',   header: 'Time' },
    { key: 'task',   header: 'Task' },
    { key: 'status', header: 'Status' },
  ];
  return (
    <>
      <div className="section-hd">Today&apos;s Jobsheet</div>
      <DataTable columns={cols} rows={TASKS} getRowKey={(r) => r.time} />
    </>
  );
}
