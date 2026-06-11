import { COUNTRIES_BY_REGION } from '../../data/countries.js';

/**
 * Country select with optgroups by region. Used by company info, dept-lead
 * cards, and the holidays HQ/branch pickers.
 */
export default function CountrySelect({ value, onChange, includeEmpty, emptyLabel = '— Select Country —', ...rest }) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      {includeEmpty && <option value="">{emptyLabel}</option>}
      {Object.entries(COUNTRIES_BY_REGION).map(([region, countries]) => (
        <optgroup key={region} label={`── ${region} ──`}>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </optgroup>
      ))}
      <option value="Others">Others</option>
    </select>
  );
}
