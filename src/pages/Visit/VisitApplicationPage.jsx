import { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import DataTable from '../../components/DataTable/DataTable.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import { VISITS } from '../../data/visits.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

const STATUS_TONE = { Approved: 'grn', Pending: 'amb', Completed: 'blu', Rejected: 'red' };

const TABS = [
  { key: 'list', label: 'Visit List' },
  { key: 'new',  label: 'New Application' },
];

export default function VisitApplicationPage() {
  useDocumentTitle('Visit Applications');
  const [tab, setTab] = useState('list');
  const [form, setForm] = useState({});

  const cols = [
    { key: 'name',        header: 'Employee' },
    { key: 'destination', header: 'Destination' },
    { key: 'from',        header: 'From' },
    { key: 'to',          header: 'To' },
    { key: 'purpose',     header: 'Purpose' },
    { key: 'status',      header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Visit Applications" />
      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'list' && (
        <Card bodyPadding={false}>
          <DataTable columns={cols} rows={VISITS} />
        </Card>
      )}

      {tab === 'new' && (
        <Card title="New Visit Application">
          <div className="form-row">
            <FormField label="Employee" name="emp" value={form.emp || ''} onChange={(e) => setForm({ ...form, emp: e.target.value })} />
            <FormField label="Destination" name="dst" value={form.dst || ''} onChange={(e) => setForm({ ...form, dst: e.target.value })} />
          </div>
          <div className="form-row">
            <FormField label="From" type="date" name="from" value={form.from || ''} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            <FormField label="To"   type="date" name="to"   value={form.to   || ''} onChange={(e) => setForm({ ...form, to:   e.target.value })} />
          </div>
          <div className="form-row full">
            <FormField label="Purpose" as="textarea" name="purpose" value={form.purpose || ''} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
          <div className="save-row">
            <Button variant="outline" onClick={() => setForm({})}>Reset</Button>
            <Button onClick={() => { setTab('list'); setForm({}); }}>Submit</Button>
          </div>
        </Card>
      )}
    </>
  );
}
