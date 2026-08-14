/* Employee data layer — backed by the Laravel API (GET /client/get-employees).
   The list/table needs a small, stable shape; backend column names are read
   defensively and mapped via toEmployeeRow. */

import { api } from './apiClient.js';
import { API_ENDPOINTS, assetUrl } from '../config/api.js';

/** Backend status code → label. */
export const EMPLOYEE_STATUS = {
  0: 'Inactive',
  1: 'Active',
  2: 'Ex-employee',
  3: 'Going Onboard',
  4: 'Notice Period',
  5: 'Probation Period',
  6: 'Terminated',
};

/** Options for the Status filter dropdown. */
export const EMP_STATUSES = [
  'All', 'Active', 'Probation Period', 'Going Onboard',
  'Notice Period', 'Ex-employee', 'Terminated', 'Inactive',
];

const PALETTE = ['#1e40af', '#166534', '#7e22ce', '#92400e', '#b91c1c', '#0e7490', '#be185d', '#4338ca'];

const initialsOf = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '—';

/** Stable colour per employee so avatars don't flicker between renders. */
const colorOf = (key) => {
  const s = String(key ?? '');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

/** One backend employee row → the shape the Employees list/table expects. */
export const toEmployeeRow = (e = {}) => {
  const name =
    e.name ||
    [e.first_name, e.last_name].filter(Boolean).join(' ') ||
    e.full_name ||
    '';
  const base = Number(e.basic_salary || 0);
  return {
    id:       e.id,
    name,
    email:    e.email ?? '',
    pos:      e.position ?? e.job_title ?? e.designation ?? e.pos ?? '',
    dept:     e.department ?? e.dept ?? '',
    status:   EMPLOYEE_STATUS[e.status] ?? (e.status ?? ''),
    initials: initialsOf(name),
    color:    colorOf(e.id ?? name),
    photo:    (e.photoname || e.photo_name || e.photo) ? assetUrl(e.photoname || e.photo_name || e.photo) : '',
    // Employees-table columns
    contractPeriod: e.contract_period ?? '',
    baseSalary:     base,
    allowance:      Number(e.allowance_1 || 0),
    // Employer MPF estimate: 5% of basic, capped at MYR 1,500.
    mpf:            Math.min(Math.round(base * 0.05), 1500),
    joinDate:       e.joined_date ?? '',
    probation:      e.probation ?? '',   // 'Completed' | 'In Progress'
    lastDay:        e.last_day ?? '',
  };
};

const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
/** Treat empty / "0000-00-00" placeholder dates as blank. */
const cleanDate = (v) => (!v || String(v).startsWith('0000') ? '' : v);

const STATION_LABELS = { WFH: 'Work From Home', home: 'Work From Home', office: 'In Office', hybrid: 'Hybrid' };
const expandStation = (v) => STATION_LABELS[v] ?? (v || '');

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Turn the per-day working_day record into workDays / start / end strings. */
const deriveSchedule = (wd = {}) => {
  const working = WEEKDAYS.filter((d) => wd[d] && String(wd[d]).toLowerCase() !== 'off');
  if (working.length === 0) return { workDays: '', workStart: '', workEnd: '' };
  const range = String(wd[working[0]]);
  const [start = '', end = ''] = range.includes('-') ? range.split('-') : [];
  const workDays = `${cap(working[0])} – ${cap(working[working.length - 1])}`;
  return { workDays, workStart: start.trim(), workEnd: end.trim() };
};

const WORK_DAYS = [
  ['monday', 'Monday'], ['tuesday', 'Tuesday'], ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'], ['friday', 'Friday'], ['saturday', 'Saturday'], ['sunday', 'Sunday'],
];

/** "09:00" | "18:00" | "9:00 AM" → "9:00 AM" / "6:00 PM". */
const to12h = (t) => {
  const s = String(t ?? '').trim();
  if (!s) return '';
  const ap = s.match(/(\d{1,2}):?(\d{2})?\s*([ap]m)/i);
  if (ap) return `${parseInt(ap[1], 10)}:${ap[2] ?? '00'} ${ap[3].toUpperCase()}`;
  const m = s.match(/(\d{1,2}):(\d{2})/);
  if (!m) return s;
  let h = parseInt(m[1], 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h %= 12;
  if (h === 0) h = 12;
  return `${h}:${m[2]} ${suffix}`;
};

/** staff_working_day → per-day rows + timezone / break / arrangement. */
const buildWorkingWeek = (wd = {}, arrangement = '') => {
  const days = WORK_DAYS.map(([key, label]) => {
    const raw = String(wd[key] ?? '').trim();
    const off = !/\d/.test(raw); // a working day has clock times (digits)
    let start = '';
    let end = '';
    if (!off) {
      const [s = '', e = ''] = raw.includes('-') ? raw.split('-') : [raw, ''];
      start = to12h(s);
      end = to12h(e);
    }
    return { label, off, start, end, arrangement: off ? '' : arrangement };
  });
  const breakTime =
    wd.break_time ??
    (wd.break_start && wd.break_end ? `${to12h(wd.break_start)} – ${to12h(wd.break_end)}` : (wd.break ?? ''));
  return {
    timezone: wd.timezone ?? wd.time_zone ?? wd.tz ?? '',
    breakTime,
    arrangement,
    days,
  };
};

const LEAVE_ICONS = [
  [/annual|vacation/i, '🧳'],
  [/sick|medical/i, '🤒'],
  [/unpaid|no.?pay/i, '📄'],
  [/hospital/i, '🏥'],
  [/emergency/i, '🚨'],
  [/maternity|paternity|parental/i, '👶'],
  [/compassion|bereave/i, '🕊️'],
];
const leaveIcon = (label) => (LEAVE_ICONS.find(([re]) => re.test(label)) || [null, '📅'])[1];
const titleize = (s) =>
  String(s || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

/**
 * Normalise `leavesummary` into entitlement cards. Accepts either an array of
 * rows or an object keyed by leave type; reads used/total/remaining defensively.
 */
export const normalizeLeaveSummary = (s) => {
  if (!s) return [];
  const rows = Array.isArray(s)
    ? s
    : Object.entries(s).map(([type, v]) => (v && typeof v === 'object' ? { type, ...v } : { type, total: v }));
  return rows.map((e = {}) => {
    const label = e.label ?? e.name ?? e.type ?? e.leave_type ?? '';
    const total = Number(e.total ?? e.entitlement ?? e.entitled ?? e.allowed ?? e.quota ?? 0);
    const used = Number(e.used ?? e.taken ?? e.applied ?? e.consumed ?? 0);
    const remaining = e.remaining ?? e.balance ?? e.left ?? (total - used);
    return { label: titleize(label), icon: leaveIcon(label), used, total, remaining: Number(remaining) || 0 };
  });
};

/** One backend employee (single-employee endpoint) → the full profile shape.
 *  Reads field names from the real response; anything not provided stays blank
 *  so the profile shows only the data that's actually available. */
export const toEmployeeDetail = (e = {}) => {
  // toArray() serialises relations as snake_case of the method name, e.g.
  // userEmploymentDetail → user_employment_detail. Keep old keys as fallbacks.
  const emp = e.user_employment_detail ?? e.employment_detail ?? e.userEmploymentDetail ?? {};
  const wd = e.staff_working_day ?? e.working_day ?? e.staffWorkingDay ?? {};
  const basic = e.user_basic_detail ?? e.userBasicDetail ?? {};
  const bank = e.user_bank_detail ?? e.userBankDetail ?? {};
  const schedule = deriveSchedule(wd);
  const row = toEmployeeRow({
    ...e,
    position: e.position ?? emp.position,
    department: e.department ?? emp.department,
  });
  const photoPath = basic.photoname || basic.photo_name || e.photoname || e.photo_name || basic.photo || e.photo || '';
  return {
    ...row,
    photo:       photoPath ? assetUrl(photoPath) : '',
    username:      e.username ?? '',
    firstName:     e.first_name ?? '',
    lastName:      e.last_name ?? '',
    otherName:     e.other_name ?? '',      // shown as "Display Name"
    nameInChinese: e.name_in_chinese ?? '',
    phone:         e.mobilenumber ?? e.phone ?? '',
    // Personal fields from userBasicDetail (names read defensively).
    ic:          basic.nric_passport_no ?? basic.ic ?? basic.nric ?? '',
    nricPassportFile: basic.nric_passport_no_file ? assetUrl(basic.nric_passport_no_file) : '',
    dob:         cleanDate(basic.dob ?? basic.date_of_birth ?? basic.birth_date),
    nationality: basic.nationality ?? '',
    gender:      basic.gender ?? basic.sex ?? '',
    addr:        basic.permanent_address ?? basic.address ?? basic.addr ?? basic.residential_address ?? basic.current_address ?? '',
    holidayCountry: basic.holiday_country ?? basic.designated_holiday_country ?? e.holiday_country ?? emp.holiday_country ?? '',
    // Bank details from userBankDetail (names read defensively).
    bank: {
      name:        bank.bank_name ?? bank.bank ?? '',
      accountName: bank.account_name ?? bank.account_holder ?? bank.holder_name ?? '',
      accountNo:   bank.account_number ?? bank.account_no ?? bank.acc_no ?? '',
      branch:      bank.branch ?? bank.bank_branch ?? '',
      swift:       bank.swift ?? bank.swift_code ?? '',
    },
    // Employment detail relation.
    startDate:   cleanDate(emp.join_date || emp.on_board),
    contract:    emp.type_of_employment ?? '',
    probation:   cleanDate(emp.probation),
    reportTo:    emp.report_to ?? emp.reporting_to ?? e.report_to ?? '',
    noticePeriod: emp.notice_period ?? emp.resign_period ?? emp.notice ?? '',
    lastDay:     cleanDate(emp.contract_end || emp.last_day || e.last_day),
    resignationLetter: (emp.resignation_letter ?? emp.resign_letter ?? basic.resignation_letter)
      ? assetUrl(emp.resignation_letter ?? emp.resign_letter ?? basic.resignation_letter)
      : '',
    grade:       emp.grade ?? '',
    arrangement: expandStation(emp.work_station),
    timezone:    '',
    breakTime:   '',
    // Working-day relation (schedule).
    workDays:    schedule.workDays,
    workStart:   schedule.workStart,
    workEnd:     schedule.workEnd,
    workingWeek: buildWorkingWeek(wd, expandStation(emp.work_station)),
    // Salary breakdown (only base + total are available; rest unknown → 0).
    base:        num(emp.basic_salary),
    housing:     0,
    transport:   0,
    mpf:         0,
    eor:         0,
    total:       num(emp.total_payment),
    leave:       e.leave ?? {},
    leaveSummary: normalizeLeaveSummary(e.leave_entitlements ?? e.leavesummary ?? e.leave_summary),
    leaveApplications: Array.isArray(e.leave_applications ?? e.leaveApplications)
      ? (e.leave_applications ?? e.leaveApplications)
      : [],
    devices:     Array.isArray(e.devices) ? e.devices : [],
    attendance:  Array.isArray(e.attendance) ? e.attendance : [],
    jobsheet:    Array.isArray(e.jobsheet) ? e.jobsheet : [],
    claims:      Array.isArray(e.claims) ? e.claims : [],
    employmentDetail: emp,
    workingDay: wd,
    basicDetail: basic,
    bankDetail: bank,
  };
};

const fetchEmployees = async () => {
  const res = await api.get(API_ENDPOINTS.CLIENT_GET_EMPLOYEES);
  // Response shape: { client: { employees: [...] } }
  const rows =
    res?.client?.employees ??
    res?.client_employees?.employees ??
    res?.employees ??
    res?.data ??
    (Array.isArray(res) ? res : []);
  return Array.isArray(rows) ? rows.map(toEmployeeRow) : [];
};

export const employeeService = {
  list: fetchEmployees,
  getById: async (id) => {
    const res = await api.get(`${API_ENDPOINTS.CLIENT_GET_EMPLOYEES}/${id}`);
    const e = res?.employee ?? res?.data ?? null;
    return e ? toEmployeeDetail(e) : null;
  },
  countActive: async () => {
    const list = await fetchEmployees();
    return list.filter((e) => e.status === 'Active').length;
  },

  /**
   * POST /client/generate-attendance-report → returns a link to a generated
   * PDF for the given user/month/year. Resolves to an absolute PDF URL (or '').
   */
  generateAttendanceReport: async ({ userId, month, year }) => {
    const res = await api.post(API_ENDPOINTS.CLIENT_ATTENDANCE_REPORT, {
      user_id: userId,
      month,
      year,
    });
    // Find the PDF link no matter which key the backend uses.
    const path =
      res?.pdf_url ?? res?.pdf ?? res?.url ?? res?.file ?? res?.link ?? res?.report_url ?? res?.data?.pdf_url ??
      findPdfLink(res);
    return path ? assetUrl(path) : '';
  },

  /** GET /client/employee-jobsheet?user_id&date → tasks for a user on a given date. */
  getJobsheet: async ({ userId, date }) => {
    const qs = new URLSearchParams({ user_id: userId, date }).toString();
    const res = await api.get(`${API_ENDPOINTS.CLIENT_EMPLOYEE_JOBSHEET}?${qs}`);
    const rows = res?.task_logs ?? res?.jobsheet ?? res?.tasks ?? res?.data ?? (Array.isArray(res) ? res : []);
    return Array.isArray(rows) ? rows : [];
  },
};

/** Recursively scan a value for the first string that looks like a PDF link. */
function findPdfLink(v) {
  if (typeof v === 'string') return /\.pdf(\?|#|$)/i.test(v) ? v : '';
  if (Array.isArray(v)) {
    for (const x of v) { const f = findPdfLink(x); if (f) return f; }
    return '';
  }
  if (v && typeof v === 'object') {
    for (const x of Object.values(v)) { const f = findPdfLink(x); if (f) return f; }
    return '';
  }
  return '';
}
