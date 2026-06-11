/* Country list grouped by region. Used by Company Info / Dept Leads /
   Operations / Holidays selectors. */

export const COUNTRIES_BY_REGION = {
  'Asia Pacific': [
    'Hong Kong SAR', 'Macau SAR', 'China (Mainland)', 'Taiwan', 'Malaysia',
    'Singapore', 'Philippines', 'Indonesia', 'Thailand', 'Vietnam',
    'Japan', 'South Korea', 'India', 'Australia', 'New Zealand',
  ],
  Europe: [
    'United Kingdom', 'Germany', 'France', 'Netherlands', 'Spain',
    'Italy', 'Switzerland', 'Sweden',
  ],
  Americas: ['United States', 'Canada', 'Mexico', 'Brazil'],
  'Middle East / Africa': ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'South Africa'],
};

export const COUNTRIES_FLAT = [
  ...Object.values(COUNTRIES_BY_REGION).flat(),
  'Others',
];

export const TIMEZONES_BY_REGION = {
  'Asia Pacific': [
    'UTC+8 — HKT  Hong Kong Time (Default)',
    'UTC+8 — MYT  Malaysia Time',
    'UTC+8 — PHT  Philippines Time',
    'UTC+8 — SGT  Singapore Time',
    'UTC+8 — TWN  Taiwan Time',
    'UTC+9 — JST  Japan Standard Time',
    'UTC+9 — KST  Korea Standard Time',
    'UTC+7 — ICT  Indochina Time (TH/VN)',
    'UTC+5:30 — IST  India Standard Time',
    'UTC+10 — AEST  Australian Eastern Time',
  ],
  Europe: [
    'UTC+0 — GMT  Greenwich Mean Time (UK)',
    'UTC+1 — CET  Central European Time',
    'UTC+2 — EET  Eastern European Time',
  ],
  Americas: [
    'UTC-5 — EST  Eastern Standard Time (US)',
    'UTC-6 — CST  Central Standard Time (US)',
    'UTC-8 — PST  Pacific Standard Time (US)',
  ],
  'Middle East': [
    'UTC+4 — GST  Gulf Standard Time (UAE)',
    'UTC+3 — AST  Arabia Standard Time (KSA)',
  ],
};

/** Look up a country's display-friendly timezone label. */
export const COUNTRY_TZ = {
  'Hong Kong SAR': 'HKT (UTC+8)',
  Malaysia: 'MYT (UTC+8)',
  Philippines: 'PHT (UTC+8)',
  Taiwan: 'CST (UTC+8)',
  Singapore: 'SGT (UTC+8)',
  Indonesia: 'WIB (UTC+7)',
  Vietnam: 'ICT (UTC+7)',
  India: 'IST (UTC+5:30)',
  Thailand: 'ICT (UTC+7)',
  Japan: 'JST (UTC+9)',
  'South Korea': 'KST (UTC+9)',
  Australia: 'AEST (UTC+10)',
  'United Kingdom': 'GMT (UTC+0)',
  'United States': 'EST (UTC-5)',
  Canada: 'EST (UTC-5)',
  Germany: 'CET (UTC+1)',
  France: 'CET (UTC+1)',
  'United Arab Emirates': 'GST (UTC+4)',
};
