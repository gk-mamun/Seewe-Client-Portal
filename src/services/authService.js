import { api, setToken } from './apiClient.js';
import { API_ENDPOINTS } from '../config/api.js';

/* ── localStorage keys (token is in apiClient.js) ──────────────── */
const CLIENT_KEY = 'sww_client';

const readClient = () => {
  try { return JSON.parse(localStorage.getItem(CLIENT_KEY) || 'null'); }
  catch { return null; }
};
const writeClient = (client) => {
  if (client) localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
  else        localStorage.removeItem(CLIENT_KEY);
};

/** Fields that MUST be present before the client can use the rest of the app. */
const REQUIRED_FIELDS = ['company_name', 'company_address', 'country', 'email'];

export const authService = {
  /**
   * Restore the previously stored client (if any) — used by AuthProvider
   * on app boot so a refresh doesn't kick the user back to /login.
   */
  restore: () => readClient(),

  /**
   * POST /client/login → on success store the bearer token + client payload.
   * Throws ApiError on bad credentials / disabled portal / network failure.
   */
  login: async ({ username, password }) => {
    const res = await api.post(
      API_ENDPOINTS.CLIENT_LOGIN,
      { username, password },
      { auth: false }
    );
    setToken(res.token);
    writeClient(res.client);
    return res.client;
  },

  /**
   * POST /client/activate → set the client's password and enable portal
   * access. `identifier` is the registered username OR email.
   *
   * Backend rules: password min:6, must match `password_confirmation`.
   * No token is returned — the client signs in afterwards via /login.
   * Throws ApiError on no-match (404), already-activated (409) or
   * validation failure (422); `err.data.message` holds the reason.
   */
  activate: async ({ identifier, password, passwordConfirmation }) => {
    return api.post(
      API_ENDPOINTS.CLIENT_ACTIVATE,
      {
        identifier,
        password,
        password_confirmation: passwordConfirmation,
      },
      { auth: false }
    );
  },

  /** Clear token + cached client and (best-effort) tell the backend. */
  logout: async () => {
    try { await api.post(API_ENDPOINTS.CLIENT_LOGOUT); } catch { /* ignore */ }
    setToken(null);
    writeClient(null);
  },

  /** Persist client edits locally after a successful PUT /client/profile. */
  updateCachedClient: (patch) => {
    const next = { ...(readClient() || {}), ...patch };
    writeClient(next);
    return next;
  },

  /**
   * Onboarding gate: returns true only when every required field has a
   * non-empty value. Whitespace-only counts as empty.
   */
  isClientComplete: (client) =>
    !!client && REQUIRED_FIELDS.every((f) => String(client[f] ?? '').trim() !== ''),

  REQUIRED_FIELDS,
};
