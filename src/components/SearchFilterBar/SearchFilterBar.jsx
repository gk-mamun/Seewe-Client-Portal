import './SearchFilterBar.css';

/**
 * Controlled search + filter bar. The page owns the state; this component
 * only renders inputs and emits change events.
 *
 *   <SearchFilterBar
 *     search={q} onSearchChange={setQ}
 *     filters={[
 *       { name: 'status', value: status, options: ['All', 'Active'], onChange: setStatus },
 *     ]}
 *     count={`${results.length} results`}
 *     onClear={() => { setQ(''); setStatus('All'); }}
 *   />
 */
export default function SearchFilterBar({
  search,
  onSearchChange,
  placeholder = 'Search…',
  filters = [],
  count,
  onClear,
}) {
  return (
    <div className="sf-bar">
      <div className="sf-search">
        <span className="sf-ico" aria-hidden="true">🔍</span>
        <input
          className="sf-inp"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {filters.map((f) => (
        <select
          key={f.name}
          className="sf-sel"
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          aria-label={f.label || f.name}
        >
          {f.options.map((opt) => (
            <option key={opt} value={opt}>
              {f.label ? `${f.label}: ${opt}` : opt}
            </option>
          ))}
        </select>
      ))}
      {onClear && (
        <button type="button" className="sf-clear" onClick={onClear}>
          Clear
        </button>
      )}
      {count != null && <span className="sf-count">{count}</span>}
    </div>
  );
}
