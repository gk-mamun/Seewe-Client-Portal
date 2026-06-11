/* Dept-lead taxonomy: every responsibility a lead may own, with theme colors. */

export const ALL_CHARGES = [
  'Leave Approval',
  'Claim Approval',
  'Holiday Management',
  'Daily Timesheet Report',
  'Attendance Report',
  'Performance Review',
  'Onboarding',
  'Software License',
  'Agreement',
  'Colleagues Personal Details',
  'Invoice',
  'General Announcement',
];

export const CHARGE_COLORS = {
  'Leave Approval':              { color: '#1e40af', bg: '#eff6ff' },
  'Claim Approval':              { color: '#7e22ce', bg: '#f5f3ff' },
  'Holiday Management':          { color: '#0891b2', bg: '#ecfeff' },
  'Daily Timesheet Report':      { color: '#92400e', bg: '#fff7ed' },
  'Attendance Report':           { color: '#c2410c', bg: '#fff7ed' },
  'Performance Review':          { color: '#be185d', bg: '#fdf2f8' },
  Onboarding:                    { color: '#065f46', bg: '#ecfdf5' },
  'Software License':            { color: '#0e7490', bg: '#ecfeff' },
  Agreement:                     { color: '#7c3aed', bg: '#faf5ff' },
  'Colleagues Personal Details': { color: '#0891b2', bg: '#ecfeff' },
  Invoice:                       { color: '#166534', bg: '#f0fdf4' },
  'General Announcement':        { color: '#b45309', bg: '#fffbeb' },
};

export const DEFAULT_LEADS = [
  {
    dept: 'Operations', icon: '⚙', name: 'Carol Ng', title: 'Project Manager',
    email: 'carol.ng@company.com', officePhone: '+852 3XXX XXXX', phone: '+60 16-789 0123',
    pref: 'Both', loc: 'Malaysia',
    charges: ['Leave Approval', 'Holiday Management', 'Daily Timesheet Report', 'Attendance Report', 'General Announcement'],
  },
  {
    dept: 'Finance', icon: '💰', name: '—', title: 'Finance Manager',
    email: 'finance@company.com', officePhone: '+852 3XXX XXXX', phone: '—',
    pref: 'Email', loc: 'Hong Kong SAR',
    charges: ['Claim Approval', 'Invoice', 'Agreement'],
  },
  {
    dept: 'HR', icon: '👥', name: '—', title: 'HR Manager',
    email: 'hr@company.com', officePhone: '+852 3XXX XXXX', phone: '—',
    pref: 'Both', loc: 'Hong Kong SAR',
    charges: ['Leave Approval', 'Onboarding', 'Performance Review', 'Colleagues Personal Details'],
  },
  {
    dept: 'IT', icon: '💻', name: 'Alice Chan', title: 'Software Engineer',
    email: 'alice.chan@company.com', officePhone: '+852 3XXX XXXX', phone: '+60 12-345 6789',
    pref: 'WhatsApp', loc: 'Malaysia',
    charges: ['Daily Timesheet Report', 'Attendance Report', 'Onboarding', 'Software License'],
  },
];
