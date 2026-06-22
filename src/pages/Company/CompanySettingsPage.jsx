import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import Button from '../../components/Button/Button.jsx';

import CompanyInfoTab from './tabs/CompanyInfoTab.jsx';
import DeptLeadsTab   from './tabs/DeptLeadsTab.jsx';
import OperationsTab  from './tabs/OperationsTab.jsx';
import HolidaysTab    from './tabs/HolidaysTab.jsx';
import BillingTab     from './tabs/BillingTab.jsx';

import { companyService } from '../../services/companyService.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './CompanySettingsPage.css';
import './tabs/dept-leads.css';
import './tabs/operations.css';
import './tabs/holidays-tab.css';
import './tabs/billing.css';

const TABS = [
  { key: 'company',    label: 'Company Info' },
  { key: 'team',       label: 'Dept Leads' },
  { key: 'operations', label: 'Operations' },
  { key: 'holidays',   label: 'Holidays' },
  { key: 'billing',    label: 'Billing' },
];

const TAB_COMPONENTS = {
  company:    CompanyInfoTab,
  team:       DeptLeadsTab,
  operations: OperationsTab,
  holidays:   HolidaysTab,
  billing:    BillingTab,
};

export default function CompanySettingsPage() {
  useDocumentTitle('Company');
  const [tab, setTab] = useState('company');
  const [editing, setEditing] = useState(false);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    companyService
      .getDetails()
      .then((d) => { if (alive) setDetails(d); })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load company details.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const ActiveTab = TAB_COMPONENTS[tab];

  return (
    <>
      <PageHeader
        title="Company"
        actions={
          editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={() => setEditing(false)}>✓ Save Changes</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>✎ Edit</Button>
          )
        }
      />

      <Card>
        <div className={`form-body ${editing ? '' : 'sett-view'}`}>
          <PageTabs tabs={TABS} active={tab} onChange={setTab} />
          {loading ? (
            <div style={{ padding: 24, color: 'var(--c-text-soft)' }}>Loading company details…</div>
          ) : error ? (
            <div style={{ padding: 24, color: 'var(--c-danger)' }}>{error}</div>
          ) : (
            <ActiveTab editing={editing} details={details} />
          )}
        </div>
      </Card>
    </>
  );
}
