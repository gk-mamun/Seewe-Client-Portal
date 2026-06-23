import { API_BASE_URL } from '../config/api.js';

/**
 * Thrown for any non-2xx response. Carries the HTTP status and the parsed
 * JSON body so callers can pull `err.data.message`, `err.data.errors`, etc.
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const TOKEN_KEY = 'sww_token';

/** Read the bearer token saved at login. */
export const getToken = () => localStorage.getItem(TOKEN_KEY);
/** Persist (or clear) the bearer token. */
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else       localStorage.removeItem(TOKEN_KEY);
};

/**
 * Low-level request helper. Adds JSON + auth headers and parses the response.
 * Most callers will use `api.get` / `api.post` / `api.put` / `api.delete`.
 */
async function request(endpoint, { method = 'GET', body, auth = true, headers = {} } = {}) {
  // FormData (file uploads) must be sent as-is so the browser sets the
  // multipart boundary; only JSON bodies get the JSON Content-Type + stringify.
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const finalHeaders = {
    Accept: 'application/json',
    ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError('Network error — please check your connection.', 0, null);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

export const api = {
  get:    (endpoint, opts)       => request(endpoint, { ...opts, method: 'GET' }),
  post:   (endpoint, body, opts) => request(endpoint, { ...opts, method: 'POST',   body }),
  put:    (endpoint, body, opts) => request(endpoint, { ...opts, method: 'PUT',    body }),
  patch:  (endpoint, body, opts) => request(endpoint, { ...opts, method: 'PATCH',  body }),
  delete: (endpoint, opts)       => request(endpoint, { ...opts, method: 'DELETE' }),
};
