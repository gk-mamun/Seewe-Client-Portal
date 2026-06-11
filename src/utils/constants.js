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
  { key: 'info',       label: 'Info' },
  { key: 'salary',     label: 'Salary' },
  { key: 'leave',      label: 'Leave' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'jobsheet',   label: 'Jobsheet' },
  { key: 'claims',     label: 'Claims' },
  { key: 'devices',    label: 'Devices' },
  { key: 'appraisal',  label: 'Appraisal' },
];
