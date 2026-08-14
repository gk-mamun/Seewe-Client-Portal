import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar.jsx';
import { claimsService } from '../../services/claimsService.js';
import { CLAIM_TYPE_ICONS } from '../../data/claims.js';
import useFilteredList from '../../hooks/useFilteredList.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatMYR } from '../../utils/format.js';
import './ClaimsPage.css';

const STATUS_TONE = { Pending: 'amb', Approved: 'grn', Paid: 'blu', Rejected: 'red' };

const TABS = [
  { key: 'pending',  label: 'Pending Approval', icon: '⏳', note: 'Review and action each request' },
  { key: 'approved', label: 'Approved',         icon: '✓' },
  { key: 'rejected', label: 'Rejected',         icon: '✗' },
  { key: 'all',      label: 'All Claims',       icon: '🧾' },
];

const PAGE_SIZE = 8;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (v) => {
  const [y, m, d] = String(v ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (v ?? '');
};

export default function ClaimsPage() {
  useDocumentTitle('Claims');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [fYear, setFYear] = useState('All');
  const [fMonth, setFMonth] = useState('All');
  const [summary, setSummary] = useState({});
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [tab, search, type, fYear, fMonth]);

  useEffect(() => {
    let alive = true;
    claimsService
      .list()
      .then((rows) => { if (alive) { setItems(rows); setSummary(claimsService.getSummary()); } })
      .catch((err) => { if (alive) setError(err?.message || 'Failed to load claims.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const typeOptions = useMemo(
    () => ['All', ...Array.from(new Set(items.map((c) => c.type).filter(Boolean)))],
    [items]
  );

  const counts = useMemo(() => ({
    pending: items.filter((c) => c.status === 'Pending').length,
    approved: items.filter((c) => c.status === 'Approved').length,
    rejected: items.filter((c) => c.status === 'Rejected').length,
    all: items.length,
  }), [items]);

  // Year/month filters apply to Approved / Rejected / All (not Pending).
  const showDateFilter = tab !== 'pending';
  const years = useMemo(
    () => Array.from(new Set(items.map((c) => String(c.date).slice(0, 4)).filter((y) => /^\d{4}$/.test(y)))).sort().reverse(),
    [items]
  );

  const byTab = useMemo(
    () => (tab === 'all' ? items : items.filter((c) => c.status.toLowerCase() === tab)),
    [items, tab]
  );
  const searched = useFilteredList(byTab, { search, filters: { type }, searchFields: ['name', 'email', 'type', 'desc'] });
  const filtered = useMemo(() => {
    if (!showDateFilter) return searched;
    return searched.filter((c) => {
      const [y, m] = String(c.date).slice(0, 10).split('-');
      return (fYear === 'All' || y === fYear) && (fMonth === 'All' || Number(m) === Number(fMonth));
    });
  }, [searched, showDateFilter, fYear, fMonth]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const act = async (id, status) => {
    if (busyId) return;
    setBusyId(id);
    setToast({ msg: `Updating claim to ${status}…`, tone: 'info' });
    try {
      const next = await claimsService.setStatus(id, status);
      setItems([...next]);
      setSummary(claimsService.getSummary());
      setToast({ msg: `Claim ${status.toLowerCase()}.`, tone: 'success' });
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setToast({ msg: err?.message || 'Could not update the claim.', tone: 'error' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setBusyId(null);
    }
  };

  const activeTab = TABS.find((t) => t.key === tab) || TABS[0];

  return (
    <>
      <PageHeader title="Claims" />

      <div style={{ marginBottom: 16 }}>
        <Card>
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search employee or description…"
            filters={[{ name: 'type', value: type, options: typeOptions, onChange: setType }]}
          />
        </Card>
      </div>

      {loading ? (
        <p style={{ color: 'var(--c-text-soft)' }}>Loading claims…</p>
      ) : error ? (
        <p style={{ color: 'var(--c-danger)' }}>{error}</p>
      ) : (
        <div className="claims-layout">
          <nav className="claims-tabs" aria-label="Claim status">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`claims-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                <span aria-hidden="true">{t.icon}</span>
                <span className="tab-label">{t.label}</span>
                <span className="tab-count">{counts[t.key]}</span>
              </button>
            ))}
          </nav>

          <section className="claims-list">
            <header className="claims-list-hd">
              <div className="hd-title">
                {activeTab.label}
                <Badge tone="red">{filtered.length}</Badge>
              </div>
              {tab === 'pending' ? (
                activeTab.note && <div className="hd-note">{activeTab.note}</div>
              ) : (
                <div className="hd-totals">
                  <span className="hd-total approved">Approved: {formatMYR(summary.total_approved)}</span>
                  <span className="hd-total rejected">Rejected: {formatMYR(summary.total_rejected)}</span>
                </div>
              )}
            </header>

            {showDateFilter && (
              <div className="claim-filters">
                <select className="claim-filter-sel" value={fYear} onChange={(e) => setFYear(e.target.value)}>
                  <option value="All">All Years</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select className="claim-filter-sel" value={fMonth} onChange={(e) => setFMonth(e.target.value)}>
                  <option value="All">All Months</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="claim-empty">No claims in this view.</div>
            ) : (
              pageRows.map((c) => (
                <div key={c.id} className="claim-row">
                  <Avatar initials={c.initials} color={c.color} photo={c.photo} alt={c.name} size={40} />
                  <div className="claim-body">
                    <div className="claim-name">
                      {c.name} <span className="c-type">— {CLAIM_TYPE_ICONS[c.type] || '💰'} {c.type}</span>
                    </div>
                    <div className="claim-meta">
                      {formatMYR(c.amount)} <span className="c-date">· {fmtDate(c.date)}</span>
                    </div>
                    {c.desc && <div className="claim-desc">{c.desc}</div>}
                    {c.file && (
                      <a className="claim-file" href={c.file} target="_blank" rel="noopener noreferrer">
                        📄 {c.fileName || 'Receipt'}
                      </a>
                    )}
                    <div className="claim-sub">Submitted: {fmtDate(c.submitted)}</div>
                  </div>
                  <div className="claim-actions">
                    {c.status === 'Pending' ? (
                      <>
                        <Button variant="success" disabled={busyId === c.id} onClick={() => act(c.id, 'Approved')}>✓ Approve</Button>
                        <Button variant="danger"  disabled={busyId === c.id} onClick={() => act(c.id, 'Rejected')}>✗ Reject</Button>
                      </>
                    ) : (
                      <Badge tone={STATUS_TONE[c.status] || 'gry'}>{c.status}</Badge>
                    )}
                  </div>
                </div>
              ))
            )}

            {filtered.length > PAGE_SIZE && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--c-border-soft)' }}>
                <span style={{ fontSize: 12, color: 'var(--c-text-soft)' }}>
                  Page {safePage} of {totalPages} · {filtered.length} claim(s)
                </span>
                <button type="button" className="btn bol" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <button type="button" className="btn bol" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </section>
        </div>
      )}

      {toast && <ClaimToast msg={toast.msg} tone={toast.tone} />}
    </>
  );
}

const TOAST_STYLE = {
  info:    { bg: 'var(--c-info-bg)',    border: 'var(--c-info-border)',    color: 'var(--c-info)' },
  success: { bg: 'var(--c-success-bg)', border: 'var(--c-success-border)', color: 'var(--c-success)' },
  error:   { bg: 'var(--c-danger-bg)',  border: 'var(--c-danger-border)',  color: 'var(--c-danger-dark)' },
};

function ClaimToast({ msg, tone = 'info' }) {
  const s = TOAST_STYLE[tone] || TOAST_STYLE.info;
  return (
    <div
      role="status"
      style={{
        position: 'fixed', left: 20, bottom: 20, zIndex: 2000,
        padding: '12px 16px', minWidth: 220, maxWidth: 360,
        background: s.bg, border: `1px solid ${s.border}`, color: s.color,
        borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600,
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      {tone === 'info' && <span aria-hidden="true">⏳</span>}
      {msg}
    </div>
  );
}
