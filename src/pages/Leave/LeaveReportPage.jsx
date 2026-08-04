import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import LeaveRequestItem from '../../components/LeaveRequestItem/LeaveRequestItem.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import { leaveService } from '../../services/leaveService.js';
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './leave-balance.css';

const TABS = [
  { key: 'pending',  label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'balance',  label: 'Leave Balance' },
];

const PAGE_SIZE = 8;

export default function LeaveReportPage() {
  useDocumentTitle('Leave Report');
  const [items, setItems] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [fYear, setFYear] = useState('All');
  const [fType, setFType] = useState('All');
  const [actionErr, setActionErr] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let alive = true;
    leaveService
      .list()
      .then((rows) => { if (alive) { setItems(rows); setBalances(leaveService.getEntitlements()); } })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load leave applications.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const showFilter = tab === 'approved';
  const years = useMemo(
    () => Array.from(new Set(items.map((a) => String(a.from).slice(0, 4)).filter((y) => /^\d{4}$/.test(y)))).sort().reverse(),
    [items]
  );
  const types = useMemo(
    () => Array.from(new Set(items.map((a) => a.type).filter(Boolean))),
    [items]
  );

  const searched = useFilteredList(
    items.filter((a) => a.status.toLowerCase() === tab),
    { search, searchFields: ['name', 'email'] }
  );
  const visible = useMemo(() => {
    if (!showFilter) return searched;
    return searched.filter((a) => {
      const y = String(a.from).slice(0, 4);
      return (fYear === 'All' || y === fYear) && (fType === 'All' || a.type === fType);
    });
  }, [searched, showFilter, fYear, fType]);

  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [tab, search, fYear, fType]);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handle = (setStatus) => async (id) => {
    if (busyId) return;
    setActionErr('');
    setBusyId(id);
    try {
      const next = await leaveService.setStatus(id, setStatus);
      setItems([...next]);
    } catch (err) {
      setActionErr(err?.message || 'Could not update the leave status. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Leave Report" />

      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      {actionErr && (
        <div role="alert" style={{
          margin: '0 0 12px', padding: '10px 14px', fontSize: 13, fontWeight: 600,
          background: 'var(--c-danger-bg)', border: '1px solid var(--c-danger-border)',
          color: 'var(--c-danger-dark)', borderRadius: 'var(--r-sm)',
        }}>{actionErr}</div>
      )}

      {tab === 'balance' ? (
        <LeaveBalance rows={balances} loading={loading} error={error} />
      ) : (
        <Card bodyPadding={false}>
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search employee name or email…"
            count={`${visible.length} request(s)`}
            onClear={() => setSearch('')}
          />
          {showFilter && (
            <div className="lr-filter">
              <span className="lr-label">Filter by:</span>
              <select value={fYear} onChange={(e) => setFYear(e.target.value)}>
                <option value="All">All Years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={fType} onChange={(e) => setFType(e.target.value)}>
                <option value="All">All Types</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          {loading ? (
            <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Loading leave applications…</p>
          ) : error ? (
            <p style={{ padding: 20, color: 'var(--c-danger)' }}>{error}</p>
          ) : visible.length === 0 ? (
            <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>No requests in this view.</p>
          ) : (
            <>
              {pageRows.map((r) => (
                <LeaveRequestItem
                  key={r.id}
                  request={r}
                  onApprove={handle('Approved')}
                  onReject={handle('Rejected')}
                />
              ))}
              {visible.length > PAGE_SIZE && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '12px 18px' }}>
                  <span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
                    Page {safePage} of {totalPages} · {visible.length} request(s)
                  </span>
                  <button type="button" className="btn bol" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                  <button type="button" className="btn bol" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </>
  );
}

/* ── Leave Balance view ── */

function LeaveBalance({ rows, loading, error }) {
  const year = new Date().getFullYear();
  return (
    <Card
      title={`Leave Balance — ${year}`}
      actions={<span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>Click "+ More" to see additional leave types</span>}
      bodyPadding={false}
    >
      {loading ? (
        <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Loading balances…</p>
      ) : error ? (
        <p style={{ padding: 20, color: 'var(--c-danger)' }}>{error}</p>
      ) : rows.length === 0 ? (
        <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>No leave balances available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="lb-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>🧳 Annual Leave</th>
                <th>🤒 Sick Leave</th>
                <th>Other Leave</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e, i) => <BalanceRow key={e.name || i} emp={e} />)}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function TypeCell({ t }) {
  if (!t) return <span className="lb-total">—</span>;
  return (
    <>
      <div className="lb-total">{t.entitlement} days</div>
      <div className="lb-used">Used: {t.used}</div>
      <div className="lb-left">{t.balance} <span className="lb-left-lbl">left</span></div>
    </>
  );
}

const MORE_COLOR = { hospital: 'var(--c-success)', inlieu: '#7e22ce' };
const moreSub = (t) => {
  if (t.key === 'inlieu') return 'Days added to balance';
  if (!t.entitlement) return 'Entitlement: Unlimited';
  return `Entitlement: ${t.entitlement} days`;
};

function BalanceRow({ emp }) {
  const [open, setOpen] = useState(false);
  const annual = emp.types.find((t) => t.key === 'annual');
  const sick = emp.types.find((t) => t.key === 'sick');
  const more = emp.types.filter((t) => t.key !== 'annual' && t.key !== 'sick');

  return (
    <>
      <tr>
        <td>
          <div className="lb-emp">
            <Avatar initials={emp.initials} color={emp.color} photo={emp.photo} alt={emp.name} size={34} />
            <div>
              <div className="lb-emp-name">{emp.name}</div>
              <div className="lb-emp-pos">{emp.pos}</div>
            </div>
          </div>
        </td>
        <td><TypeCell t={annual} /></td>
        <td><TypeCell t={sick} /></td>
        <td>
          {more.length > 0
            ? (
              <button type="button" className="lb-more-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                {open ? '− More' : '+ More'}
              </button>
            )
            : <span className="lb-total">—</span>}
        </td>
      </tr>
      {more.length > 0 && (
        <tr>
          <td className="lb-more-cell" colSpan={4}>
            <div className={`lb-more-wrap ${open ? 'open' : ''}`}>
              <div className="lb-more-cards">
                {more.map((t) => (
                  <div key={t.label} className="lb-more-card">
                    <div className="lb-more-label">{t.label}</div>
                    <div className="lb-more-num" style={{ color: MORE_COLOR[t.key] || 'var(--c-text)' }}>{t.balance}</div>
                    <div className="lb-more-sub">{moreSub(t)}</div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
