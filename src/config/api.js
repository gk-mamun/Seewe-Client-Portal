/**
 * Central place to configure the Laravel backend URL + every endpoint
 * the React app talks to.
 *
 * To switch environments (dev / staging / prod), change ONE value:
 *   API_BASE_URL — or set VITE_API_BASE_URL in a .env file.
 *
 * Endpoints are kept relative ("/client/login") so callers always
 * compose `${API_BASE_URL}${API_ENDPOINTS.X}` — never hard-code the URL.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://teamdev.seewework.com/api';

/**
 * Origin that serves uploaded files (photos, certificates, agreements).
 * Set VITE_ASSET_BASE_URL to override it independently of the API — handy for
 * local testing where the API runs locally but the files live on the server.
 * Defaults to the API host minus the trailing `/api`.
 */
export const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, '');

/** Turn a backend-stored file path into an absolute, openable URL. */
export const assetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return `${ASSET_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
};

export const API_ENDPOINTS = {
  // ─── Auth ───────────────────────────────────────────────────────
  CLIENT_LOGIN:    '/client/login',
  CLIENT_LOGOUT:   '/client/logout',
  CLIENT_ME:       '/client/me',
  CLIENT_ACTIVATE: '/client/activate',

  // ─── Company / profile ─────────────────────────────────────────
  CLIENT_PROFILE:      '/client/profile',
  CLIENT_DETAILS:      '/client/details',          // GET full company profile (+ contacts, festivals)
  CLIENT_SAVE_DETAILS:   '/client/save-client-details',   // POST bulk company info + contacts + festivals
  CLIENT_SAVE_CONTACT:   '/client/save-client-contact',   // POST a single new contact
  CLIENT_DELETE_CONTACT: '/client/delete-client-contact', // POST { id } to delete one contact
  CLIENT_SAVE_AGREEMENT: '/client/save-client-agreement', // POST multipart { agreement: file }

  // ─── Employees ─────────────────────────────────────────────────
  CLIENT_GET_EMPLOYEES: '/client/get-employees',   // GET employees under this client (append /{id} for one)

  // ─── Leave ─────────────────────────────────────────────────────
  CLIENT_LEAVE_APPLICATIONS: '/client/leave-applications',  // GET leaves grouped by status
  CLIENT_UPDATE_LEAVE_STATUS: '/client/update-leave-status', // POST { id, status } approve/reject

  // ─── Claims ────────────────────────────────────────────────────
  CLIENT_GET_CLAIMS: '/client/get-claims',   // GET summary + claims grouped by status
  CLIENT_UPDATE_CLAIM_STATUS: '/client/update-claim-status', // POST { id, status }; returns summary

  // ─── Dashboard ─────────────────────────────────────────────────
  CLIENT_DASHBOARD: '/client/dashboard',   // GET aggregated dashboard data
};
