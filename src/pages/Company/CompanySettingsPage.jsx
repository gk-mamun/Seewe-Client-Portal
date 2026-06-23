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

import { useAuth } from '../../context/AuthContext.jsx';
import {
  companyService,
  detailsToCompany,
  detailsToContact,
  detailsToHolidays,
  contactToLead,
  buildDetailsPayload,
} from '../../services/companyService.js';
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

/** Build the three editable sections from a fetched details payload. */
const sectionsFromDetails = (d) => ({
  info: { company: detailsToCompany(d), contact: detailsToContact(d) },
  // Dept leads are the non-primary contacts; the primary one lives in the
  // Company Info tab's Primary Contact card.
  leads: (d?.contacts ?? []).filter((c) => Number(c.is_primary) !== 1).map(contactToLead),
  holidays: detailsToHolidays(d),
});

export default function CompanySettingsPage() {
  useDocumentTitle('Company');
  const { updateClient } = useAuth();
  const [tab, setTab] = useState('company');
  const [editing, setEditing] = useState(false);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editable sections — the page owns them so one Save reads all at once.
  const [info, setInfo] = useState(null);
  const [leads, setLeads] = useState(null);
  const [holidays, setHolidays] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveOk, setSaveOk] = useState(false);
  // Bumped on Cancel to remount tabs so they re-read the reverted section state.
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    companyService
      .getDetails()
      .then((d) => {
        if (!alive) return;
        setDetails(d);
        const s = sectionsFromDetails(d);
        setInfo(s.info);
        setLeads(s.leads);
        setHolidays(s.holidays);
      })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load company details.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const handleCancel = () => {
    const s = sectionsFromDetails(details);
    setInfo(s.info);
    setLeads(s.leads);
    setHolidays(s.holidays);
    setSaveError('');
    setEditing(false);
    setFormVersion((v) => v + 1);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError('');
    setSaveOk(false);
    try {
      const payload = buildDetailsPayload({ info, leads, holidays });
      await companyService.saveDetails(payload, info?.certFile);
      // Keep the cached client (sidebar + completeness gate) in sync.
      updateClient({
        company_name:    info?.company?.name ?? '',
        company_address: info?.company?.address ?? '',
        country:         info?.company?.country ?? '',
        email:           info?.contact?.email ?? '',
      });
      setSaveOk(true);
      setEditing(false);
    } catch (err) {
      setSaveError(err?.message || 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const ActiveTab = TAB_COMPONENTS[tab];

  // Contacts are added/deleted via their own endpoints (committed immediately),
  // so fold those changes into the baseline `details` — otherwise Cancel would
  // rebuild the list from stale data and resurrect a deleted (or drop an added) row.
  const handleContactAdded = (raw) => {
    setDetails((d) => (d ? { ...d, contacts: [...(d.contacts ?? []), raw] } : d));
    setEditing(false); // committed change — drop back to view mode
  };
  const handleContactDeleted = (id) => {
    setDetails((d) => (d ? { ...d, contacts: (d.contacts ?? []).filter((c) => c.id !== id) } : d));
    setEditing(false); // committed change — drop back to view mode
  };

  // Hand each editable tab its section value + setter.
  const sectionProps = {
    company:  { value: info,     onChange: setInfo },
    team:     { value: leads,    onChange: setLeads, onContactAdded: handleContactAdded, onContactDeleted: handleContactDeleted },
    holidays: { value: holidays, onChange: setHolidays },
  }[tab] || {};

  return (
    <>
      <PageHeader
        title="Company"
        actions={
          editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : '✓ Save Changes'}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => { setSaveOk(false); setEditing(true); }} disabled={loading || !!error}>
              ✎ Edit
            </Button>
          )
        }
      />

      {saveError && <div className="sett-error" role="alert" style={{ marginBottom: 12 }}>{saveError}</div>}
      {saveOk && <div className="sett-ok" role="status" style={{ marginBottom: 12 }}>✓ Changes saved.</div>}

      <Card>
        <div className={`form-body ${editing ? '' : 'sett-view'}`}>
          <PageTabs tabs={TABS} active={tab} onChange={setTab} />
          {loading ? (
            <div style={{ padding: 24, color: 'var(--c-text-soft)' }}>Loading company details…</div>
          ) : error ? (
            <div style={{ padding: 24, color: 'var(--c-danger)' }}>{error}</div>
          ) : (
            <ActiveTab key={`${tab}-${formVersion}`} editing={editing} details={details} {...sectionProps} />
          )}
        </div>
      </Card>
    </>
  );
}
