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

export const API_ENDPOINTS = {
  // ─── Auth ───────────────────────────────────────────────────────
  CLIENT_LOGIN:    '/client/login',
  CLIENT_LOGOUT:   '/client/logout',
  CLIENT_ME:       '/client/me',
  CLIENT_ACTIVATE: '/client/activate',

  // ─── Company / profile (placeholders for the next phase) ────────
  CLIENT_PROFILE: '/client/profile',
};
