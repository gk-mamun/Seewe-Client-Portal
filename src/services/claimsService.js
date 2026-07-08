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
let summary = { total_amount: 0, total_pending: 0, total_approved: 0, total_paid: 0, total_rejected: 0 };
let loaded = false;

// Pub/sub so the sidebar claims badge reacts to status changes without refetch.
const listeners = new Set();
const pendingCountOf = () => cache.filter((c) => c.status === 'Pending').length;
const emit = () => {
  const n = pendingCountOf();
  listeners.forEach((fn) => fn(n));
};

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
  emit();
  return all;
};

export const claimsService = {
  list: fetchClaims,

  /** Amount totals from the backend summary. */
  getSummary: () => summary,

  /**
   * Update a claim's status. `status` is the display label ('Approved' /
   * 'Rejected'), which matches the backend's accepted values. POSTs
   * { id, status }, then updates the cache and the summary from the response.
   */
  setStatus: async (id, status) => {
    const res = await api.post(API_ENDPOINTS.CLIENT_UPDATE_CLAIM_STATUS, { id, status });
    cache = cache.map((c) => (c.id === id ? { ...c, status } : c));
    if (res?.summary) summary = res.summary;
    emit();
    return cache;
  },

  pendingCount: async () => {
    if (!loaded) await fetchClaims();
    return pendingCountOf();
  },

  /** Subscribe to pending-count changes; returns an unsubscribe fn. */
  subscribePending: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
