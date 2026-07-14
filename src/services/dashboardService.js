/* Dashboard data layer — one aggregated call to GET /client/dashboard.
   Maps the response into the exact shapes the dashboard widgets expect. */

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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-05-09 04:40:41" → "May 9, 2026". */
const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};

/** "2026-06-07" → { dm: 7, mo: 'JUN' }. */
const dayMonth = (v) => {
  const [, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return { dm: d || '', mo: m ? MONTHS[m - 1].toUpperCase() : '' };
};

// Colour used for a holiday's country/type pill.
const TAG_COLORS = {
  MY: '#cc0000', HK: '#1e40af', SG: '#166534', TW: '#7e22ce', PH: '#0e7490',
  'Early Off': '#b45309',
};
const tagColor = (tag) => TAG_COLORS[tag] || 'var(--brand-primary)';

/** Shared person fields (name + avatar) for any employee-bearing row. */
const person = (p = {}) => ({
  name:     p.name ?? '',
  initials: initialsOf(p.name),
  color:    colorOf(p.name),
  photo:    p.photo ? assetUrl(p.photo) : '',
});

export const dashboardService = {
  get: async () => {
    const res = await api.get(API_ENDPOINTS.CLIENT_DASHBOARD);
    const d = res?.data ?? {};
    const h = d.highlights ?? {};
    const se = d.staff_events ?? {};

    return {
      stats: d.stats ?? {},

      highlights: {
        holidays:      (h.today_holidays ?? []).map((x) => ({ name: x.name, tag: x.country, col: tagColor(x.country) })),
        onLeave:       (h.on_leave_today ?? []).map((x) => ({ ...person(x), type: x.type })),
        resigning:     (h.last_day_soon ?? []).map((x) => ({ ...person(x), lastDay: x.last_day })),
        actionsNeeded: h.actions_needed ?? 0,
      },

      leaveApprovals: (d.leave_approvals ?? []).map((x) => ({
        id: x.leave_id, ...person(x), type: x.type, from: x.from, to: x.to, days: x.days, reason: x.reason,
      })),

      claimApprovals: (d.claim_approvals ?? []).map((x) => ({
        id: x.claim_id, ...person(x), type: x.type,
        amount: Number(x.amount || 0), currency: 'MYR',
        date: fmtDate(x.date), desc: x.desc ?? '',
      })),

      upcomingHolidays: (d.upcoming_holidays ?? []).map((x) => {
        const tag = x.country || x.type || '';
        return { ...dayMonth(x.date), name: x.name, tag, col: tagColor(tag) };
      }),

      upcomingLeave: (d.upcoming_leave ?? []).map((x, i) => ({
        id: i, ...person(x), type: x.type, from: x.from, to: x.to, days: x.days,
      })),

      staffEvents: {
        onboarding: [],
        probation: (se.probation ?? []).map((x) => ({ ...person(x), until: x.until })),
        resigning: (se.resigning ?? []).map((x) => ({ ...person(x), lastDay: x.last_day })),
      },
    };
  },
};
