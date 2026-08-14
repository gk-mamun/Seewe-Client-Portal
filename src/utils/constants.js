export const ROUTES = {
  LOGIN: '/login',
  PW_SETUP: '/activate',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  EMPLOYEE_NEW: '/employees/new',
  EMPLOYEE_DETAIL: '/employees/:id',
  LEAVE: '/leave',
  VISITS: '/visits',
  CLAIMS: '/claims',
  COMPANY: '/company',
  CONTACT: '/contact',
};

export const ONBOARDING_STEPS = [
  'Company Info',
  'Contacts',
  'Holidays',
  'Billing Setup',
  'Review',
];

export const EMP_PROFILE_TABS = [
  { key: 'info',       label: 'Personal Info' },
  { key: 'salary',     label: 'Salary' },
  { key: 'leave',      label: 'Leave' },
  { key: 'attendance', label: 'Attendance Report' },
  { key: 'jobsheet',   label: 'Daily Jobsheet' },
  { key: 'appraisal',  label: 'Appraisal' },
  { key: 'claims',     label: 'Claims' },
  { key: 'documents',  label: 'Document & Contract' },
];
