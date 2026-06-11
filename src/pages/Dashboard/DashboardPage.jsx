import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';

import TenantBadge        from './TenantBadge.jsx';
import TodayHighlights    from './TodayHighlights.jsx';
import DashboardStatCard, { DashboardStatGrid } from './DashboardStatCard.jsx';
import LeaveApprovalsCard from './LeaveApprovalsCard.jsx';
import ClaimApprovalsCard from './ClaimApprovalsCard.jsx';
import UpcomingHolidaysCard from './UpcomingHolidaysCard.jsx';
import UpcomingLeaveCard  from './UpcomingLeaveCard.jsx';
import StaffEventsCard    from './StaffEventsCard.jsx';
import AttendanceCard     from './AttendanceCard.jsx';

import { employeeService } from '../../services/employeeService.js';
import { leaveService } from '../../services/leaveService.js';
import { claimsService } from '../../services/claimsService.js';
import { HOLIDAYS, TODAY_HOLIDAYS } from '../../data/holidays.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

import './DashboardPage.css';

const firstName = (n) => (n || '').split(' ')[0];

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const [employees, setEmployees]  = useState([]);
  const [leaveApps, setLeaveApps]  = useState([]);
  const [claims, setClaims]        = useState([]);

  useEffect(() => {
    employeeService.list().then(setEmployees);
    leaveService.list().then(setLeaveApps);
    claimsService.list().then(setClaims);
  }, []);

  // ─── Derived data ────────────────────────────────────────────────
  const pendingLeave  = useMemo(() => leaveApps.filter((a) => a.status === 'Pending'),  [leaveApps]);
  const approvedLeave = useMemo(() => leaveApps.filter((a) => a.status === 'Approved'), [leaveApps]);
  const pendingClaims = useMemo(() => claims.filter((c) => c.status === 'Pending'),     [claims]);
  const totalClaimAmt = pendingClaims.reduce((s, c) => s + c.amount, 0);
  const actionsNeeded = pendingLeave.length + pendingClaims.length;

  const active      = employees.filter((e) => e.status === 'Active');
  const onProbation = employees.filter((e) => e.probation?.includes('In Progress'));
  const onboarding  = employees.filter((e) => {
    if (e.status === 'Ongoing Onboard') return true;
    // Anyone who started in the last 60 days counts as "onboarding" for the dashboard
    if (!e.startDate) return false;
    const start = new Date(e.startDate);
    if (Number.isNaN(start.valueOf())) return false;
    return (Date.now() - start.valueOf()) / 86_400_000 < 60;
  });
  const resigning   = employees.filter((e) => e.lastDay);

  // Today Highlights inputs
  const onLeaveToday = approvedLeave.slice(0, 2);

  // Staff Events buckets — use the same data, just shaped for the widget
  const staffBuckets = {
    onboarding: onboarding.filter((e) => e.status !== 'Active' || e.probation?.includes('In Progress')),
    probation:  onProbation,
    resigning,
  };

  return (
    <>
      <PageHeader title="Dashboard" actions={<TenantBadge />} />

      {/* Today Highlights banner */}
      <TodayHighlights
        holidays={TODAY_HOLIDAYS}
        onLeave={onLeaveToday}
        resigning={resigning}
        actionsNeeded={actionsNeeded}
      />

      {/* 5 stat boxes */}
      <DashboardStatGrid>
        <DashboardStatCard icon="👥" label="Active Employees" value={active.length} valueColor="var(--brand-primary-dark)" sub="Total headcount" />
        <DashboardStatCard icon="📋" label="On Probation"     value={onProbation.length} valueColor="var(--c-info)"
          sub={onProbation.length ? onProbation.map((e) => firstName(e.name)).join(', ') : 'None active'} />
        <DashboardStatCard icon="✎"  label="Onboarding"       value={employees.filter((e) => e.status === 'Ongoing Onboard').length} valueColor="#7e22ce"
          sub={employees.filter((e) => e.status === 'Ongoing Onboard').length
            ? employees.filter((e) => e.status === 'Ongoing Onboard').map((e) => firstName(e.name)).join(', ')
            : 'None'} />
        <DashboardStatCard icon="📅" label="Pending Leave"    value={pendingLeave.length} valueColor="var(--c-warning)"
          sub="Awaiting approval" subColor="var(--c-warning)" />
        <DashboardStatCard icon="💰" label="Pending Claims"   value={pendingClaims.length} valueColor="var(--c-warning)"
          sub={`MYR ${totalClaimAmt.toLocaleString()}`} subColor="var(--c-warning)" />
      </DashboardStatGrid>

      {/* Leave + Claim approvals */}
      <div className="dash-2col">
        <LeaveApprovalsCard items={pendingLeave} />
        <ClaimApprovalsCard items={pendingClaims} />
      </div>

      {/* Holidays + Leave + Staff Events */}
      <div className="dash-3col">
        <UpcomingHolidaysCard holidays={HOLIDAYS} />
        <UpcomingLeaveCard items={approvedLeave} />
        <StaffEventsCard buckets={staffBuckets} />
      </div>

      {/* Today's Attendance */}
      <AttendanceCard />
    </>
  );
}
