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

/** Normalise any status string/group key to Approved / Rejected / Pending. */
const normStatus = (v) => {
  const s = String(v ?? '').toLowerCase().trim();
  if (s.includes('approve')) return 'Approved';
  if (s.includes('reject') || s.includes('decline')) return 'Rejected';
  return 'Pending'; // waiting / pending / in progress / anything else
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
  // Prefer the group key (from a status-grouped object); fall back to the row's status.
  status:      normStatus((group != null && group !== '') ? group : l.status),
});

/* ── Leave Balance (leave_entitlements) ─────────────────────────── */

const titleize = (s) =>
  String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();

const classifyLeave = (label) => {
  const s = String(label).toLowerCase();
  if (/annual|vacation/.test(s)) return 'annual';
  if (/sick|medical/.test(s)) return 'sick';
  if (/unpaid|no.?pay/.test(s)) return 'unpaid';
  if (/hospital/.test(s)) return 'hospital';
  if (/lieu|carry|earn.?time/.test(s)) return 'inlieu';
  return 'other';
};

/** One leave-type entitlement row → { key, label, entitlement, used, balance }. */
const mapType = (t = {}) => {
  const label = titleize(t.leave_type ?? t.type ?? t.name ?? '');
  const entitlement = Number(t.earned ?? t.entitlement ?? t.total ?? t.allowed ?? 0);
  const used = Number(t.taken ?? t.used ?? 0);
  const balance = t.balance ?? t.remaining ?? (entitlement - used);
  return { key: classifyLeave(label), label, entitlement, used, balance: Number(balance) || 0 };
};

/**
 * `leave_entitlements` is a flat list — one row per (employee + leave type).
 * Group them by employee so each employee is a single balance row.
 */
const groupEntitlements = (list = []) => {
  const byEmp = new Map();
  (Array.isArray(list) ? list : []).forEach((row) => {
    const key = row.applicant_id ?? row.employee_email ?? row.employee_name;
    if (!byEmp.has(key)) {
      const name = row.employee_name ?? row.name ?? '';
      byEmp.set(key, {
        name,
        pos:      row.position ?? row.designation ?? '',
        photo:    row.employee_photo ? assetUrl(row.employee_photo) : '',
        initials: initialsOf(name),
        color:    colorOf(row.applicant_id ?? name),
        types:    [],
      });
    }
    byEmp.get(key).types.push(mapType(row));
  });
  return Array.from(byEmp.values());
};

let cache = [];
let entitlements = [];
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
  const leaves = res?.leaves ?? {};
  const all = [];
  if (Array.isArray(leaves)) {
    // Flat list — status comes from each row.
    leaves.forEach((l) => all.push(mapLeave(l)));
  } else {
    // Object grouped by status: { approved:[], rejected:[], waiting:[], ... }.
    Object.entries(leaves).forEach(([group, arr]) => {
      if (Array.isArray(arr)) arr.forEach((l) => all.push(mapLeave(l, group)));
    });
  }
  cache = all;
  entitlements = groupEntitlements(res?.leave_entitlements ?? []);
  loaded = true;
  emit();
  return all;
};

export const leaveService = {
  list: fetchLeaves,

  /** Per-employee leave balances (from leave_entitlements). */
  getEntitlements: () => entitlements,

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
