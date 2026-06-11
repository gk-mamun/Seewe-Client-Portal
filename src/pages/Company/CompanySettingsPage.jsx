import { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import Button from '../../components/Button/Button.jsx';

import CompanyInfoTab from './tabs/CompanyInfoTab.jsx';
import DeptLeadsTab   from './tabs/DeptLeadsTab.jsx';
import OperationsTab  from './tabs/OperationsTab.jsx';
import HolidaysTab    from './tabs/HolidaysTab.jsx';
import BillingTab     from './tabs/BillingTab.jsx';

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
          <ActiveTab editing={editing} />
        </div>
      </Card>
    </>
  );
}
