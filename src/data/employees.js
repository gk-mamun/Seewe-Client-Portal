/* Mock employee data — sample rows from the legacy mock.
   Production swap-in: replace with services/employeeService.js fetch calls. */

const SCHEDULE_DEFAULTS = {
  workDays: 'Monday – Friday',
  workStart: '9:00 AM',
  workEnd: '6:00 PM',
  timezone: 'MYT (UTC+8)',
  arrangement: 'Remote (Work From Home)',
  breakTime: '1:00 PM – 2:00 PM',
  offDay: 'Saturday & Sunday',
  holidayCountry: 'Malaysia',
  workHours: 'Mon-Fri 9:00AM-6:00PM (MYT)',
  contract: 'N/A (Full Time)',
};

const COMP_DEFAULTS = { housing: 1500, transport: 400, mpf: 1400, eor: 1200 };

const blankLeave = () => ({
  annual:          { used: 0, total: 14 },
  medical:         { used: 0, total: 14 },
  emergency:       { used: 0, total: 3 },
  hospitalization: { used: 0, total: 60 },
});

export const EMPLOYEES = [
  {
    id: 0, name: 'Alice Chan', initials: 'AC', color: '#1e40af',
    pos: 'Software Engineer', dept: 'Technology', status: 'Active',
    email: 'alice.chan@company.com', phone: '+60 12-345 6789',
    ic: '901234-56-7890', passport: 'A12345678',
    dob: 'Mar 12, 1990', nationality: 'Malaysian', gender: 'Female',
    addr: 'No. 15, Jalan Utama 2/3, Taman Puchong Utama, 47100 Puchong, Selangor',
    startDate: 'Feb 1, 2025',
    probation: 'Completed (Aug 1, 2025)',
    reportTo: 'Carol Ng',
    ...SCHEDULE_DEFAULTS,
    base: 35000, ...COMP_DEFAULTS, housing: 2000, transport: 500, mpf: 1500, total: 40200,
    leave: { annual: { used: 4, total: 14 }, medical: { used: 2, total: 14 }, emergency: { used: 0, total: 3 }, hospitalization: { used: 0, total: 60 } },
    devices: [
      { type: 'Laptop',  brand: 'Apple', model: 'MacBook Pro 14" M3 Pro', serial: 'C02ZK1234MXG', asset: 'BT-LAP-001', issued: 'Feb 1, 2025', condition: 'Buy',          os: 'macOS Sequoia 15.3', specs: 'M3 Pro · 18GB RAM · 512GB SSD' },
      { type: 'Monitor', brand: 'Dell',  model: 'UltraSharp 27" 4K U2723D', serial: 'CN-078J9XYZ1', asset: 'BT-MON-001', issued: 'Feb 1, 2025', condition: 'Buy',          os: '—',                  specs: '27" · 4K UHD · USB-C Hub' },
      { type: 'Phone',   brand: 'Apple', model: 'iPhone 14 Pro',           serial: 'FNGE4K1A2B3C', asset: 'BT-PHN-001', issued: 'Feb 1, 2025', condition: 'Monthly Plan', os: 'iOS 17.4',           specs: '256GB · Space Black' },
    ],
  },
  {
    id: 1, name: 'Brian Lee', initials: 'BL', color: '#166534',
    pos: 'UX Designer', dept: 'Design', status: 'Active',
    email: 'brian.lee@company.com', phone: '+60 11-234 5678',
    ic: '881120-07-5432', passport: 'B23456789',
    dob: 'Nov 20, 1988', nationality: 'Malaysian', gender: 'Male',
    addr: 'Unit 8-C, Residency Condo, PJ, Selangor',
    startDate: 'Mar 15, 2025',
    probation: 'Completed (Sep 15, 2025)',
    reportTo: 'Carol Ng',
    ...SCHEDULE_DEFAULTS,
    base: 28000, ...COMP_DEFAULTS, total: 32500,
    leave: { annual: { used: 3, total: 14 }, medical: { used: 1, total: 14 }, emergency: { used: 0, total: 3 }, hospitalization: { used: 0, total: 60 } },
    devices: [],
  },
  {
    id: 2, name: 'Carol Ng', initials: 'CN', color: '#7e22ce',
    pos: 'Project Manager', dept: 'Operations', status: 'Active',
    email: 'carol.ng@company.com', phone: '+60 16-789 0123',
    ic: '850615-10-3456', passport: 'C34567890',
    dob: 'Jun 15, 1985', nationality: 'Malaysian', gender: 'Female',
    addr: 'No. 3, Lorong Mawar 5, Shah Alam, Selangor',
    startDate: 'Jan 10, 2025',
    probation: 'Completed (Jul 10, 2025)',
    reportTo: 'HQ Director',
    ...SCHEDULE_DEFAULTS, arrangement: 'Hybrid (3 days office)',
    base: 32000, ...COMP_DEFAULTS, housing: 2000, transport: 500, mpf: 1500, total: 37200,
    leave: { annual: { used: 5, total: 14 }, medical: { used: 2, total: 14 }, emergency: { used: 1, total: 3 }, hospitalization: { used: 0, total: 60 } },
    devices: [],
  },
  {
    id: 3, name: 'David Lam', initials: 'DL', color: '#92400e',
    pos: 'Sales Executive', dept: 'Sales',
    status: 'Notice Period',
    email: 'david.lam@company.com', phone: '+60 12-987 6543',
    ic: '920810-14-2345', passport: 'D45678901',
    dob: 'Aug 10, 1992', nationality: 'Malaysian', gender: 'Male',
    addr: 'Block A, Suria Residence, Cyberjaya',
    startDate: 'Jan 2, 2025',
    probation: 'Completed (Jul 2, 2025)',
    reportTo: 'Carol Ng',
    lastDay: 'Dec 31, 2026',
    resignPeriod: '1 month',
    ...SCHEDULE_DEFAULTS, arrangement: 'Hybrid (2 days office)',
    base: 24000, ...COMP_DEFAULTS, transport: 400, mpf: 1300, total: 27100,
    leave: blankLeave(),
    devices: [],
  },
  {
    id: 4, name: 'Eva Wong', initials: 'EW', color: '#d4a017',
    pos: 'Marketing Associate', dept: 'Marketing',
    status: 'Active',
    email: 'eva.wong@company.com', phone: '+60 17-555 1234',
    ic: '980402-05-7788', passport: 'E56789012',
    dob: 'Apr 2, 1998', nationality: 'Malaysian', gender: 'Female',
    addr: 'No. 22, Bukit Bintang, Kuala Lumpur',
    startDate: 'May 20, 2026',
    probation: 'In Progress (until Nov 20, 2026)',
    reportTo: 'Carol Ng',
    ...SCHEDULE_DEFAULTS,
    base: 22000, ...COMP_DEFAULTS, transport: 300, mpf: 1100, total: 25200,
    leave: blankLeave(),
    devices: [],
  },
];

export const DEPARTMENTS  = ['All', 'Technology', 'Design', 'Operations', 'Sales', 'Marketing', 'HR'];
export const EMP_STATUSES = ['All', 'Active', 'Probation', 'Notice Period', 'Resigned', 'On Leave'];
