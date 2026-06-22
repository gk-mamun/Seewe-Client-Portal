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
 * Origin that serves uploaded files (same host as the API, minus the
 * trailing `/api`). Stored paths like `storage/app/public/clients/x.jpg`
 * are served from here.
 */
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

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
  CLIENT_PROFILE: '/client/profile',
  CLIENT_DETAILS: '/client/details',   // GET full company profile (+ contacts, festivals)
};
