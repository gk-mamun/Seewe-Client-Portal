import './DataTable.css';

/**
 * Responsive table component. Pass `columns` and `rows`; on mobile each row
 * collapses to a card with data-label prefixes (matches the legacy mock).
 *
 * Example:
 *   <DataTable
 *     columns={[
 *       { key: 'name',  header: 'Employee' },
 *       { key: 'dept',  header: 'Dept' },
 *       { key: 'status',header: 'Status', render: r => <Badge tone="grn">{r.status}</Badge> },
 *     ]}
 *     rows={employees}
 *   />
 */
export default function DataTable({ columns, rows, landscape = false, emptyText = 'No records', getRowKey }) {
  const cls = `tb${landscape ? ' landscape' : ''}`;
  return (
    <div className={`tw${landscape ? ' landscape' : ''}`}>
      <table className={cls}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: 24, color: 'var(--c-text-soft)' }}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={getRowKey ? getRowKey(row) : row.id ?? idx}>
                {columns.map((c) => (
                  <td key={c.key} data-label={c.header}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
