import { ROUTES } from '../../utils/constants.js';

/** Nav items rendered into the sidebar. Edit here to add/reorder. */
export const SIDEBAR_ITEMS = [
  { key: 'dash',    to: ROUTES.DASHBOARD, icon: '\u{1F3E0}', label: 'Dashboard' },
  { key: 'emp',     to: ROUTES.EMPLOYEES, icon: '\u{1F465}', label: 'Employees' },
  { key: 'leave',   to: ROUTES.LEAVE,     icon: '\u{1F4C5}', label: 'Leave Report', badge: 'pending-leave' },
  { key: 'visit',   to: ROUTES.VISITS,    icon: '\u{1F3E2}', label: 'Visit Application' },
  { key: 'claim',   to: ROUTES.CLAIMS,    icon: '\u{1F4B0}', label: 'Claims',        badge: 'pending-claim' },
  { key: 'company', to: ROUTES.COMPANY,   icon: '\u{2699}',  label: 'Company' },
  { key: 'contact', to: ROUTES.CONTACT,   icon: '\u{1F4DE}', label: 'SeeWe Contact' },
];
