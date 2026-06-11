import { useMemo } from 'react';

/**
 * Generic search + filter hook used by employee, leave and claim pages.
 * Keeps the filtering logic out of page components.
 */
export default function useFilteredList(items, { search = '', filters = {}, searchFields = [] } = {}) {
  return useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      // free-text search
      if (q && searchFields.length) {
        const hit = searchFields.some((f) => String(item[f] ?? '').toLowerCase().includes(q));
        if (!hit) return false;
      }
      // exact-match filters (skip "All" / undefined / "")
      for (const [k, v] of Object.entries(filters)) {
        if (v == null || v === '' || v === 'All') continue;
        if (String(item[k]) !== String(v)) return false;
      }
      return true;
    });
  }, [items, search, filters, searchFields]);
}
