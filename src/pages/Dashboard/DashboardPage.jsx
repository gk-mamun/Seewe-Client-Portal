import { useEffect, useState } from 'react';
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

import { dashboardService } from '../../services/dashboardService.js';
import { employeeService } from '../../services/employeeService.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

import './DashboardPage.css';

const EMPTY = {
  stats: {},
  highlights: { holidays: [], onLeave: [], resigning: [], actionsNeeded: 0 },
  leaveApprovals: [],
  claimApprovals: [],
  upcomingHolidays: [],
  upcomingLeave: [],
  staffEvents: { onboarding: [], probation: [], resigning: [] },
  attendance: [],
};

const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' })
    .replace(/^(\w+) (.+)$/, '$2 ($1)'); // "Monday 1 Jun 2026" → "1 Jun 2026 (Monday)"

// Staff expected to clock in today (excludes ex-employees / not-yet-onboard).
const CURRENT_STAFF = new Set(['Active', 'Probation Period', 'Notice Period']);
const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

/** Show every current staff member; anyone without a clock record today is Absent. */
function mergeAttendance(attendance = [], employees = []) {
  if (!employees.length) return attendance;
  const byId = new Map();
  const byName = new Map();
  attendance.forEach((a) => {
    if (a.id != null) byId.set(String(a.id), a);
    byName.set(norm(a.name), a);
  });
  const used = new Set();
  const rows = employees
    .filter((e) => CURRENT_STAFF.has(e.status))
    .map((e) => {
      const a = (e.id != null && byId.get(String(e.id))) || byName.get(norm(e.name));
      if (a) { used.add(a); return a; }
      return {
        id: e.id, name: e.name, initials: e.initials, color: e.color, photo: e.photo,
        ci: '', bo: '', bi: '', co: '', total: '', status: 'Absent',
      };
    });
  // Keep any clock record that didn't match a listed employee.
  attendance.forEach((a) => { if (!used.has(a)) rows.push(a); });
  return rows;
}

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([dashboardService.get(), employeeService.list().catch(() => [])])
      .then(([d, employees]) => {
        if (alive) setData({ ...d, attendance: mergeAttendance(d.attendance, employees) });
      })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load the dashboard.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const { stats, highlights, leaveApprovals, claimApprovals, upcomingHolidays, upcomingLeave, staffEvents, attendance } = data;

  return (
    <>
      <PageHeader title="Dashboard" actions={<TenantBadge />} />

      {error && (
        <div role="alert" style={{
          margin: '0 0 16px', padding: '10px 14px', fontSize: 13, fontWeight: 600,
          background: 'var(--c-danger-bg)', border: '1px solid var(--c-danger-border)',
          color: 'var(--c-danger-dark)', borderRadius: 'var(--r-sm)',
        }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: 'var(--c-text-soft)' }}>Loading dashboard…</p>
      ) : (
        <>
          <TodayHighlights
            holidays={highlights.holidays}
            onLeave={highlights.onLeave}
            resigning={highlights.resigning}
            actionsNeeded={highlights.actionsNeeded}
          />

          <DashboardStatGrid>
            <DashboardStatCard icon="👥" label="Active Employees" value={stats.active_employees ?? 0}
              valueColor="var(--brand-primary-dark)" sub="Total headcount" />
            <DashboardStatCard icon="📋" label="On Probation" value={stats.on_probation ?? 0}
              valueColor="var(--c-info)" sub={stats.on_probation ? 'In progress' : 'None active'} />
            <DashboardStatCard icon="✎" label="Onboarding" value={stats.onboarding ?? 0}
              valueColor="#7e22ce" sub={stats.onboarding ? 'Joining soon' : 'None'} />
            <DashboardStatCard icon="📅" label="Pending Leave" value={stats.pending_leave ?? 0}
              valueColor="var(--c-warning)" sub="Awaiting approval" subColor="var(--c-warning)" />
            <DashboardStatCard icon="💰" label="Pending Claims" value={stats.pending_claims ?? 0}
              valueColor="var(--c-warning)"
              sub={`MYR ${Number(stats.pending_claims_amount ?? 0).toLocaleString()}`} subColor="var(--c-warning)" />
          </DashboardStatGrid>

          <div className="dash-2col">
            <LeaveApprovalsCard items={leaveApprovals} />
            <ClaimApprovalsCard items={claimApprovals} />
          </div>

          <div className="dash-3col">
            <UpcomingHolidaysCard holidays={upcomingHolidays} />
            <UpcomingLeaveCard items={upcomingLeave} />
            <StaffEventsCard buckets={staffEvents} />
          </div>

          <AttendanceCard rows={attendance} dateLabel={todayLabel()} />
        </>
      )}
    </>
  );
}
