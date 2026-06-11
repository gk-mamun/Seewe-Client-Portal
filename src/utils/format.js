export const formatHKD = (n) =>
  `HKD ${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export const formatBytes = (b) =>
  b < 1024
    ? `${b}B`
    : b < 1048576
    ? `${(b / 1024).toFixed(1)}KB`
    : `${(b / 1048576).toFixed(1)}MB`;

export const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
