/* Leave report data layer — backed by GET /client/leave-applications, which
   returns leaves grouped by status: { approved:[], rejected:[], waiting:[] }. */

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

/** Inclusive day count between two YYYY-MM-DD dates (min 1). */
const daysBetween = (from, to) => {
  const a = Date.parse(`${from}T00:00:00`);
  const b = Date.parse(`${to}T00:00:00`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 1;
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
};

// Backend status group → display label (drives the page tabs).
const STATUS_LABEL = {
  approved: 'Approved',
  rejected: 'Rejected',
  waiting: 'Pending',
  pending: 'Pending',
};

// Display label → the value the backend expects on update.
const STATUS_TO_BACKEND = {
  Approved: 'approved',
  Rejected: 'rejected',
  Pending: 'waiting',
};

/** One backend leave row → the shape LeaveRequestItem expects. */
const mapLeave = (l = {}, group) => ({
  id:          l.leave_id,
  applicantId: l.applicant_id,
  name:        l.employee_name ?? '',
  email:       l.employee_email ?? '',
  initials:    initialsOf(l.employee_name),
  color:       colorOf(l.applicant_id ?? l.employee_name),
  photo:       l.employee_photo ? assetUrl(l.employee_photo) : '',
  type:        l.leave_type ?? '',
  reason:      l.reason ?? '',
  from:        l.from_date ?? '',
  to:          l.to_date ?? '',
  days:        daysBetween(l.from_date, l.to_date),
  status:      STATUS_LABEL[group] ?? STATUS_LABEL[l.status] ?? 'Pending',
});

let cache = [];
let loaded = false;

// Pub/sub so the sidebar badge can react to approve/reject without refetching.
const listeners = new Set();
const pendingCountOf = () => cache.filter((a) => a.status === 'Pending').length;
const emit = () => {
  const n = pendingCountOf();
  listeners.forEach((fn) => fn(n));
};

const fetchLeaves = async () => {
  const res = await api.get(API_ENDPOINTS.CLIENT_LEAVE_APPLICATIONS);
  const groups = res?.leaves ?? {};
  const all = [];
  Object.entries(groups).forEach(([group, arr]) => {
    if (Array.isArray(arr)) arr.forEach((l) => all.push(mapLeave(l, group)));
  });
  cache = all;
  loaded = true;
  emit();
  return all;
};

export const leaveService = {
  list: fetchLeaves,

  /**
   * Approve/reject a leave. `status` is the display label ('Approved' /
   * 'Rejected'). POSTs { id, status } (status as the backend value), then
   * updates the cache and notifies the sidebar badge.
   */
  setStatus: async (id, status) => {
    const backendStatus = STATUS_TO_BACKEND[status] ?? String(status).toLowerCase();
    await api.post(API_ENDPOINTS.CLIENT_UPDATE_LEAVE_STATUS, { id, status: backendStatus });
    cache = cache.map((a) => (a.id === id ? { ...a, status } : a));
    emit();
    return cache;
  },

  pendingCount: async () => {
    if (!loaded) await fetchLeaves();
    return pendingCountOf();
  },

  /** Subscribe to pending-count changes; returns an unsubscribe fn. */
  subscribePending: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
