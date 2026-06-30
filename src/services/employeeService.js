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
    username:    e.username ?? '',
    phone:       e.mobilenumber ?? e.phone ?? '',
    // Personal fields from userBasicDetail (names read defensively).
    ic:          basic.ic ?? basic.nric ?? basic.ic_number ?? basic.identity_card_no ?? '',
    passport:    basic.passport ?? basic.passport_no ?? basic.passport_number ?? '',
    dob:         cleanDate(basic.dob ?? basic.date_of_birth ?? basic.birth_date),
    nationality: basic.nationality ?? '',
    gender:      basic.gender ?? basic.sex ?? '',
    addr:        basic.permanent_address ?? basic.address ?? basic.addr ?? basic.residential_address ?? basic.current_address ?? '',
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
    reportTo:    '',
    grade:       emp.grade ?? '',
    arrangement: expandStation(emp.work_station),
    timezone:    '',
    breakTime:   '',
    // Working-day relation (schedule).
    workDays:    schedule.workDays,
    workStart:   schedule.workStart,
    workEnd:     schedule.workEnd,
    // Salary breakdown (only base + total are available; rest unknown → 0).
    base:        num(emp.basic_salary),
    housing:     0,
    transport:   0,
    mpf:         0,
    eor:         0,
    total:       num(emp.total_payment),
    leave:       e.leave ?? {},
    devices:     Array.isArray(e.devices) ? e.devices : [],
    attendance:  Array.isArray(e.attendance) ? e.attendance : [],
    jobsheet:    Array.isArray(e.jobsheet) ? e.jobsheet : [],
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
};
