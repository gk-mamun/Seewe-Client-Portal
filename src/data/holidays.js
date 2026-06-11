/* Holidays surfaced on the dashboard "Upcoming Holidays" list +
   "Today Highlights" banner. */

export const HOLIDAYS = [
  { dm: '7',  mo: 'Jun', name: 'Hari Raya Aidiladha',     loc: 'Malaysia',    tag: 'MY',        col: '#cc0000', theme: 'my' },
  { dm: '1',  mo: 'Jul', name: 'HKSAR Establishment Day', loc: 'Hong Kong',   tag: 'HK',        col: '#1e40af', theme: 'hk' },
  { dm: '27', mo: 'Jul', name: 'Awal Muharram',           loc: 'Malaysia',    tag: 'MY',        col: '#cc0000', theme: 'my' },
  { dm: '31', mo: 'Aug', name: 'Malaysia National Day',   loc: 'Malaysia',    tag: 'MY',        col: '#cc0000', theme: 'my' },
  { dm: '6',  mo: 'Sep', name: 'Mid-Autumn Festival Eve', loc: 'All offices', tag: 'Early Off', col: '#92400e', theme: 'eoff' },
  { dm: '16', mo: 'Sep', name: 'Malaysia Day',            loc: 'Malaysia',    tag: 'MY',        col: '#cc0000', theme: 'my' },
];

/** Holidays falling on "today" — drive the Today Highlights banner. */
export const TODAY_HOLIDAYS = [
  { name: 'Hari Raya Aidiladha', tag: 'MY', col: '#cc0000' },
];
