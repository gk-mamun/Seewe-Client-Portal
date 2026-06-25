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

  /**
   * POST /client/save-client-details → bulk company info + contacts + festivals.
   * `files` maps a backend field name → File (e.g. `business_reg_certificate`,
   * `billing_agreement`). If any file is present the request is multipart:
   * scalars become form fields, nested arrays/objects are JSON-encoded, and
   * each file is attached under its field name. Otherwise plain JSON is sent.
   */
  saveDetails: async (payload, files = {}) => {
    const fileEntries = Object.entries(files).filter(([, f]) => f);
    if (fileEntries.length === 0) return api.post(API_ENDPOINTS.CLIENT_SAVE_DETAILS, payload);

    const fd = new FormData();
    Object.entries(payload ?? {}).forEach(([key, val]) => {
      if (val == null) return;
      fd.append(key, Array.isArray(val) || typeof val === 'object' ? JSON.stringify(val) : val);
    });
    fileEntries.forEach(([field, f]) => fd.append(field, f));
    return api.post(API_ENDPOINTS.CLIENT_SAVE_DETAILS, fd);
  },

  /** POST /client/saveClientContact → a single new contact. */
  saveContact: async (contact) => api.post(API_ENDPOINTS.CLIENT_SAVE_CONTACT, contact),

  /** POST /client/deleteClientContact → delete one contact by id. */
  deleteContact: async (id) => api.post(API_ENDPOINTS.CLIENT_DELETE_CONTACT, { id }),

  /** POST /client/save-client-agreement → upload the signed billing agreement (multipart). */
  uploadAgreement: async (file) => {
    const fd = new FormData();
    fd.append('agreement', file);
    return api.post(API_ENDPOINTS.CLIENT_SAVE_AGREEMENT, fd);
  },
};

/**
 * Normalise an "in-charge" value into a string[]. The backend `incharge`
 * column may arrive as a real array (model cast) or a JSON string like
 * '["Invoice","Service Agreement"]'.
 */
const parseCharges = (v) => {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string' && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [v.trim()];
    } catch {
      return [v.trim()];
    }
  }
  return [];
};

/**
 * One ClientContact row → a Dept Lead card model.
 * Backend columns: name, title, department, office_phone, whatsapp_mobile,
 * email, incharge. (No location/preference columns, so those stay default.)
 */
export const contactToLead = (c = {}) => ({
  id:          c.id,
  dept:        c.department ?? '',
  icon:        '👤',
  name:        c.name ?? '',
  title:       c.title ?? '',
  email:       c.email ?? '',
  officePhone: c.office_phone ?? '',
  phone:       c.whatsapp_mobile ?? '',
  pref:        c.contact_preference ?? 'Email',
  loc:         c.location ?? '',
  charges:     parseCharges(c.incharge),
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

/* ───────────────────────────────────────────────────────────────────
   Initialisers: backend details → the section shapes the tabs edit.
   The page owns these so a single Save can read all sections at once.
   ─────────────────────────────────────────────────────────────────── */

export const detailsToCompany = (d = {}) => ({
  name:            d.company_name     ?? '',
  brn:             d.br_no            ?? '',
  industry:        d.industry         ?? '',
  yearEstablished: d.year_established  ?? '',
  employees:       d.no_of_employees  ?? '',
  website:         d.company_website  ?? '',
  address:         d.company_address  ?? '',
  country:         d.country          ?? '',
  intro:           d.basic_intro      ?? '',
});

/**
 * The Primary Contact card is the contact row flagged is_primary = 1.
 * If there's no such row, every field stays blank (no client email/country
 * fallback) — so an untouched block shows nothing and isn't saved as a row.
 */
export const detailsToContact = (d = {}) => {
  const primary = (d.contacts ?? []).find((c) => Number(c.is_primary) === 1) ?? {};
  return {
    id:        primary.id,
    name:      primary.name ?? '',
    title:     primary.title ?? '',
    officeNum: primary.office_phone ?? '',
    mobile:    primary.whatsapp_mobile ?? '',
    email:     primary.email ?? '',
    pref:      primary.contact_preference ?? 'Both',
    location:  primary.location ?? '',
  };
};

export const detailsToHolidays = (d = {}) => ({
  hqCountry:       d.country ?? '',
  branchCountries: [],
  earlyOff:        [],
  customs:         (d.festivals ?? []).map(festivalToHoliday).map((h) => ({ ...h, checked: true })),
});

/** Billing tab data (read-only except the agreement file).
 *  Returns null when there's no real billing row (no id) — the client can't
 *  upload an agreement because there'd be nothing to update. */
export const detailsToBilling = (d = {}) => {
  const b = d.billing_info;
  if (!b || b.id == null) return null;
  return {
    invoiceCurrency:    b.invoice_currency ?? '',
    paymentTerms:       b.payment_terms ?? '',
    invoiceFrequency:   b.invoice_frequency ?? '',
    monthlyInvoiceDate: b.monthly_invoice_date ?? '',
    currentStatus:      b.current_status ?? '',
    notice:             b.notice ?? '',
    agreementPath:      b.agreement ?? '',
  };
};

/* ───────────────────────────────────────────────────────────────────
   Save mappers: section shapes → backend columns. Mirrors the fetch
   structure (flat company fields + `contacts` + `festivals`).
   ─────────────────────────────────────────────────────────────────── */

/** Dept-lead card → ClientContact columns (non-primary). */
const leadToContact = (l = {}) => ({
  ...(Number.isInteger(l.id) ? { id: l.id } : {}),
  name:            l.name ?? '',
  title:           l.title ?? '',
  department:      l.dept ?? '',
  office_phone:    l.officePhone ?? '',
  whatsapp_mobile: l.phone ?? '',
  email:           l.email ?? '',
  incharge:        Array.isArray(l.charges) ? l.charges : [],
  is_primary:      0,
});

/** Primary Contact card → ClientContact columns (is_primary = 1). */
const primaryToContact = (x = {}) => ({
  ...(Number.isInteger(x.id) ? { id: x.id } : {}),
  name:               x.name ?? '',
  title:              x.title ?? '',
  department:         '',
  office_phone:       x.officeNum ?? '',
  whatsapp_mobile:    x.mobile ?? '',
  email:              x.email ?? '',
  contact_preference: x.pref ?? '',
  location:           x.location ?? '',
  incharge:           [],
  is_primary:         1,
});

/** Holiday entry → ClientFestival columns. */
const holidayToFestival = (h = {}) => ({
  ...(Number.isInteger(h.id) ? { id: h.id } : {}),
  name:    h.name ?? '',
  date:    h.date ?? '',
  time:    h.time ?? '',
  applies: Array.isArray(h.applies) ? h.applies : [],
});

/** Add-contact form → ClientContact columns (single new row). */
export const contactFormToPayload = (f = {}) => ({
  name:               f.lead ?? '',
  title:              '',
  department:         f.dept ?? '',
  office_phone:       f.phone ?? '',
  whatsapp_mobile:    f.wa ?? '',
  email:              f.email ?? '',
  contact_preference: f.pref ?? '',
  location:           f.loc ?? '',
  incharge:           Array.isArray(f.charges) ? f.charges : [],
  is_primary:         0,
});

/** Bundle all three edited sections into the saveClientDetails payload. */
export const buildDetailsPayload = ({ info, leads, holidays } = {}) => {
  const c = info?.company ?? {};
  const x = info?.contact ?? {};
  // The primary contact is saved as a contact row (is_primary = 1), alongside
  // the dept leads (is_primary = 0). Skip it only if completely empty.
  const primary = primaryToContact(x);
  const hasPrimary = (primary.name && primary.name.trim()) || (primary.email && primary.email.trim());
  return {
    company_name:     c.name ?? '',
    company_address:  c.address ?? '',
    br_no:            c.brn ?? '',
    country:          c.country ?? '',
    year_established: c.yearEstablished ?? '',
    company_website:  c.website ?? '',
    industry:         c.industry ?? '',
    no_of_employees:  c.employees ?? '',
    basic_intro:      c.intro ?? '',
    email:            x.email ?? '',
    hq_country:        holidays?.hqCountry ?? '',
    branch_countries:  holidays?.branchCountries ?? [],
    contacts:  [
      ...(hasPrimary ? [primary] : []),
      ...(leads ?? []).map(leadToContact),
    ],
    festivals: [...(holidays?.earlyOff ?? []), ...(holidays?.customs ?? [])].map(holidayToFestival),
  };
};
