/* Mock leave applications surfaced on the dashboard + Leave Report page. */

export const LEAVE_APPLICATIONS = [
  // ── Pending — dashboard "Leave Approvals" widget ────────────────
  { id: 1, empId: 1, name: 'Brian Lee',  initials: 'BL', color: '#166534', type: 'Annual Leave', from: 'Jun 23, 2026', to: 'Jun 24, 2026', days: 2, reason: 'Family trip to Penang',          status: 'Pending' },
  { id: 2, empId: 3, name: 'David Lam',  initials: 'DL', color: '#92400e', type: 'Annual Leave', from: 'Jun 30, 2026', to: 'Jul 2, 2026',  days: 3, reason: 'Personal matters',              status: 'Pending' },
  { id: 3, empId: 0, name: 'Alice Chan', initials: 'AC', color: '#1e40af', type: 'Sick Leave',   from: 'Jun 19, 2026', to: 'Jun 19, 2026', days: 1, reason: 'Medical appointment - MC attached', status: 'Pending' },

  // ── Approved — "Upcoming Leave" + Today Highlights banner ───────
  { id: 4, empId: 2, name: 'Carol Ng',  initials: 'CN', color: '#7e22ce', type: 'Annual Leave', from: 'Jun 5, 2026',  to: 'Jun 6, 2026',  days: 2, reason: 'Long weekend trip', status: 'Approved' },
  { id: 5, empId: 1, name: 'Brian Lee', initials: 'BL', color: '#166534', type: 'Annual Leave', from: 'May 19, 2026', to: 'May 21, 2026', days: 3, reason: 'Vacation',          status: 'Approved' },
  { id: 6, empId: 4, name: 'Eva Wong',  initials: 'EW', color: '#d4a017', type: 'Sick Leave',   from: 'Jun 10, 2026', to: 'Jun 10, 2026', days: 1, reason: 'Recovery',          status: 'Approved' },
  { id: 7, empId: 0, name: 'Alice Chan', initials: 'AC', color: '#1e40af', type: 'Annual Leave', from: 'Apr 7, 2026',  to: 'Apr 11, 2026', days: 5, reason: 'Family holiday',    status: 'Approved' },
];

export const LEAVE_TYPES = ['All', 'Annual Leave', 'Sick Leave', 'Medical', 'Emergency', 'Hospitalization'];
