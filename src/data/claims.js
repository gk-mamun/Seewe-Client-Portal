export const CLAIM_TYPE_ICONS = {
  Medical:    '🏥',
  Transport:  '🚗',
  Meals:      '🍰',
  Equipment:  '💻',
  Training:   '📚',
  Internet:   '🌐',
  Wellness:   '🧘',
  Other:      '💰',
};

export const CLAIMS = [
  // ── Pending — surface on dashboard "Claim Approvals" ────────────
  { id: 1, empId: 0, name: 'Alice Chan', initials: 'AC', color: '#1e40af', type: 'Medical',   currency: 'MYR', amount: 450, date: 'Jun 15, 2026', desc: 'Medical consultation + prescription at KPJ Damansara', receipt: 'kpj-jun.pdf',   status: 'Pending'  },
  { id: 2, empId: 1, name: 'Brian Lee',  initials: 'BL', color: '#166534', type: 'Transport', currency: 'MYR', amount: 88,  date: 'Jun 12, 2026', desc: 'Grab rides to client office for project meeting',       receipt: 'grab-jun.png',  status: 'Pending'  },
  { id: 3, empId: 3, name: 'David Lam',  initials: 'DL', color: '#92400e', type: 'Equipment', currency: 'MYR', amount: 320, date: 'Jun 8, 2026',  desc: 'USB-C Hub + HDMI cable for remote work setup',          receipt: 'shopee.pdf',    status: 'Pending'  },
  { id: 4, empId: 4, name: 'Eva Wong',   initials: 'EW', color: '#d4a017', type: 'Transport', currency: 'MYR', amount: 55,  date: 'Jun 18, 2026', desc: 'Grab to company event orientation',                    receipt: 'grab2.png',     status: 'Pending'  },

  // ── Resolved — used by Claims page tabs ─────────────────────────
  { id: 5, empId: 2, name: 'Carol Ng',   initials: 'CN', color: '#7e22ce', type: 'Training',  currency: 'MYR', amount: 1500, date: 'Mar 15, 2026', desc: 'PMI certification renewal',         receipt: 'pmi-cert.pdf',   status: 'Approved' },
  { id: 6, empId: 0, name: 'Alice Chan', initials: 'AC', color: '#1e40af', type: 'Internet',  currency: 'MYR', amount: 180,  date: 'Mar 30, 2026', desc: 'Home internet — Mar',               receipt: 'celcom-mar.pdf', status: 'Approved' },
  { id: 7, empId: 1, name: 'Brian Lee',  initials: 'BL', color: '#166534', type: 'Wellness',  currency: 'MYR', amount: 350,  date: 'Feb 10, 2026', desc: 'Annual gym membership',             receipt: 'gym.pdf',        status: 'Rejected' },
];

export const CLAIM_TYPES = ['All', ...Object.keys(CLAIM_TYPE_ICONS)];
