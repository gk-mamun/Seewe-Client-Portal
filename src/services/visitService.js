/* Client visit application — POST /client/save-visitor-form.
   Maps the New Application form fields onto the backend's fillable columns. */

import { api } from './apiClient.js';
import { API_ENDPOINTS } from '../config/api.js';

/**
 * Build the request body from the form state + signed-in client id.
 * Field names match the backend `$fillable` exactly.
 */
export const toVisitorPayload = (form = {}, clientId) => ({
  client_id:            clientId ?? null,

  // Visitor details
  visitor_name1:        form.visitorName ?? '',
  visitor_position1:    form.designation ?? '',
  visitor_name2:        form.visitorName2 ?? '',
  visitor_position2:    form.designation2 ?? '',
  name:                 form.visitorName ?? '',
  company_name:         form.company ?? '',
  contact_no:           form.contact ?? '',
  referred_by:          form.referredBy ?? '',
  referred_company_name: form.referredCompany ?? '',

  // Visit details
  branch:               form.location ?? '',
  visit_duration:       form.duration ?? '',
  visit_purpose:        form.purpose ?? '',
  visiting_date:        form.visitDate ?? '',
  visiting_time:        form.visitTime ?? '',
  visiting_start_date:  form.visitDate ?? '',
  visiting_start_time:  form.visitTime ?? '',
  visiting_end_date:    form.visitEndDate ?? '',
  visiting_end_time:    form.visitEndTime ?? '',
  special_request:      form.notes ?? '',

  // Involved employees — array of user ids (backend field: user_id)
  user_id:              Array.isArray(form.employees) ? form.employees : [],

  // Acknowledgement / signature
  signed_by:            form.ackName ?? '',
  esign:                form.signature ?? '',   // visitor signature (base64 data URL)
  staff_esign:          form.staffSignature ?? '',
});

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};

/** One backend visitor-form record → a row for the "All Visits" table. */
const toRow = (f = {}, i) => ({
  id:       f.id ?? f.uniq_id ?? i,
  visitor:  f.visitor_name1 ?? f.name ?? '',
  company:  f.company_name ?? '',
  location: f.branch ?? '',
  date:     fmtDate(f.visiting_date),
  time:     f.visiting_time ?? '',
  purpose:  f.visit_purpose ?? '',
  duration: f.visit_duration ?? '',
});

export const visitService = {
  /** POST the visitor form. `clientId` is the logged-in client/employer id. */
  submit: async (form, clientId) =>
    api.post(API_ENDPOINTS.CLIENT_SAVE_VISITOR_FORM, toVisitorPayload(form, clientId)),

  /** GET all visitor forms for the logged-in client → table rows. */
  list: async () => {
    const res = await api.get(API_ENDPOINTS.CLIENT_VISITOR_FORMS);
    const rows = res?.forms ?? res?.visitor_forms ?? res?.data ?? (Array.isArray(res) ? res : []);
    return Array.isArray(rows) ? rows.map(toRow) : [];
  },
};
