/* Claims data layer — backed by GET /client/get-claims, which returns a
   summary plus claims grouped by status: { pending:[], approved:[], rejected:[] }. */

import { api } from './apiClient.js';
import { API_ENDPOINTS, assetUrl } from '../config/api.js';

const PALETTE = ['#1e40af', '#166534', '#7e22ce', '#92400e', '#b91c1c', '#0e7490', '#be185d', '#4338ca'];

const initialsOf = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '—';

const colorOf = (key) => {
  const s = String(key ?? '');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

const STATUS_LABEL = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

/** One backend claim → the shape the claims table expects. */
const mapClaim = (c = {}, group) => ({
  id:       c.claim_id,
  name:     c.employee_name ?? '',
  email:    c.employee_email ?? '',
  photo:    c.employee_photo ? assetUrl(c.employee_photo) : '',
  initials: initialsOf(c.employee_name),
  color:    colorOf(c.claim_id ?? c.employee_name),
  type:     c.type ?? '',
  amount:   Number(c.amount || 0),
  date:     c.date ?? '',
  status:   STATUS_LABEL[group] ?? STATUS_LABEL[String(c.status).toLowerCase()] ?? (c.status ?? 'Pending'),
});

let cache = [];
let summary = { total_amount: 0, total_pending: 0, total_approved: 0, total_rejected: 0 };
let loaded = false;

const fetchClaims = async () => {
  const res = await api.get(API_ENDPOINTS.CLIENT_GET_CLAIMS);
  summary = res?.summary ?? summary;
  const groups = res?.claims ?? {};
  const all = [];
  Object.entries(groups).forEach(([group, arr]) => {
    if (Array.isArray(arr)) arr.forEach((c) => all.push(mapClaim(c, group)));
  });
  cache = all;
  loaded = true;
  return all;
};

export const claimsService = {
  list: fetchClaims,

  /** Amount totals from the backend summary. */
  getSummary: () => summary,

  // No approve/reject endpoint yet — update the local cache optimistically.
  setStatus: async (id, status) => {
    cache = cache.map((c) => (c.id === id ? { ...c, status } : c));
    return cache;
  },

  pendingCount: async () => {
    if (!loaded) await fetchClaims();
    return cache.filter((c) => c.status === 'Pending').length;
  },
};
