import { api } from './apiClient.js';
import { API_ENDPOINTS } from '../config/api.js';

/**
 * Company profile data layer. Talks to GET /client/details, which returns
 * the flat client record plus two related collections:
 *   • contacts  → rendered as Dept Leads
 *   • festivals → rendered as Holidays
 *
 * The mappers below normalise the backend rows into the shapes the tab
 * components expect. They read several possible column names with a
 * fallback to '' so unknown/absent fields simply stay empty.
 */
export const companyService = {
  /** GET /client/details → the `client` payload (or null). */
  getDetails: async () => {
    const res = await api.get(API_ENDPOINTS.CLIENT_DETAILS);
    return res?.client ?? null;
  },
};

/** One ClientContact row → a Dept Lead card model. */
export const contactToLead = (c = {}) => ({
  dept:        c.department ?? c.dept ?? c.role ?? '',
  icon:        '👤',
  name:        c.name ?? c.contact_name ?? c.contact_person ?? '',
  title:       c.title ?? c.job_title ?? c.designation ?? c.position ?? '',
  email:       c.email ?? c.contact_email ?? '',
  officePhone: c.office_phone ?? c.office_number ?? c.office ?? '',
  phone:       c.phone ?? c.mobile ?? c.whatsapp ?? c.contact_number ?? c.contact_no ?? '',
  pref:        c.preference ?? c.contact_pref ?? c.pref ?? 'Email',
  loc:         c.location ?? c.country ?? '',
  charges:     Array.isArray(c.charges) ? c.charges : [],
});

/** Pull the BR certificate path off the details payload (tolerant of naming). */
export const certificatePathOf = (details = {}) =>
  details?.business_reg_certificate ??
  details?.business_registration_certificate ??
  details?.br_certificate ??
  details?.br_cert ??
  details?.certificate ??
  '';

/** One ClientFestival row → a Holiday entry. */
export const festivalToHoliday = (f = {}, i = 0) => ({
  id:      f.id ?? `festival-${i}`,
  name:    f.name ?? f.festival_name ?? f.title ?? f.occasion ?? '',
  date:    f.date ?? f.festival_date ?? f.holiday_date ?? '',
  time:    f.time ?? f.early_off_time ?? f.off_time ?? '14:00',
  applies: Array.isArray(f.applies) ? f.applies : [],
});
