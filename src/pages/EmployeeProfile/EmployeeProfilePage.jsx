import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import ProfileBanner from './ProfileBanner.jsx';
import { employeeService } from '../../services/employeeService.js';
import { EMP_PROFILE_TABS, ROUTES } from '../../utils/constants.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

import InfoTab       from './tabs/InfoTab.jsx';
import SalaryTab     from './tabs/SalaryTab.jsx';
import LeaveTab      from './tabs/LeaveTab.jsx';
import AttendanceTab from './tabs/AttendanceTab.jsx';
import JobsheetTab   from './tabs/JobsheetTab.jsx';
import ClaimsTab     from './tabs/ClaimsTab.jsx';
import DevicesTab    from './tabs/DevicesTab.jsx';
import AppraisalTab  from './tabs/AppraisalTab.jsx';

import './EmployeeProfilePage.css';

const TAB_COMPONENTS = {
  info: InfoTab,
  salary: SalaryTab,
  leave: LeaveTab,
  attendance: AttendanceTab,
  jobsheet: JobsheetTab,
  claims: ClaimsTab,
  devices: DevicesTab,
  appraisal: AppraisalTab,
};

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tab, setTab] = useState('info');
  useDocumentTitle(employee?.name);

  useEffect(() => {
    employeeService.getById(id).then(setEmployee);
  }, [id]);

  if (!employee) {
    return (
      <>
        <PageHeader title="Employee" />
        <p>Loading…</p>
      </>
    );
  }

  const ActiveTab = TAB_COMPONENTS[tab] || InfoTab;

  return (
    <>
      <PageHeader
        title={
          <span>
            <Link to={ROUTES.EMPLOYEES} style={{ color: 'var(--c-text-soft)', fontWeight: 400 }}>Employees</Link>
            {' / '}{employee.name}
          </span>
        }
      />

      <ProfileBanner employee={employee} />

      <div className="card prof-card-tabs">
        <PageTabs tabs={EMP_PROFILE_TABS} active={tab} onChange={setTab} />
        <div className="prof-body">
          <ActiveTab employee={employee} />
        </div>
      </div>
    </>
  );
}
