import { TIMEZONES_BY_REGION } from '../../data/countries.js';

export default function TimezoneSelect({ value, onChange, ...rest }) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      {Object.entries(TIMEZONES_BY_REGION).map(([region, zones]) => (
        <optgroup key={region} label={`── ${region} ──`}>
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </optgroup>
      ))}
    </select>
  );
}
