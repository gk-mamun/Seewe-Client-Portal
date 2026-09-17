import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import PageTabs from '../../components/PageTabs/PageTabs.jsx';
import DataTable from '../../components/DataTable/DataTable.jsx';
import Button from '../../components/Button/Button.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import { employeeService } from '../../services/employeeService.js';
import { visitService } from '../../services/visitService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './VisitApplicationPage.css';

const TABS = [
  { key: 'list', label: 'All Visits' },
  { key: 'new',  label: 'New Application' },
];

const LOCATIONS = [
  'Medan Connaught',
  'Sunway Velocity',
];
const DURATIONS = ['30 minutes', '1 hour', '2 hours', 'Half day (4 hours)', 'Full day'];
const PURPOSES = [
  'Quarterly Operations Review',
  'Client Meeting',
  'Audit / Compliance',
  'Training Session',
  'Site Inspection',
  'Other',
];

// Seed the dropdown defaults into state so they're always sent, even if untouched.
const initialForm = () => ({
  employees: [],
  location: LOCATIONS[0],
  duration: DURATIONS[1],
  purpose: PURPOSES[0],
});

/* ── Signature pad (mouse + touch) ─────────────────────────────── */
const SignaturePad = forwardRef(function SignaturePad(_props, apiRef) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const dirty = useRef(false); // true once anything has been drawn

  useEffect(() => {
    const c = ref.current;
    if (c) { c.width = c.offsetWidth; c.height = c.offsetHeight; }
  }, []);

  const pos = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  };
  const start = (e) => { drawing.current = true; const ctx = ref.current.getContext('2d'); const { x, y } = pos(e); ctx.beginPath(); ctx.moveTo(x, y); };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = ref.current.getContext('2d');
    const { x, y } = pos(e);
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#111';
    ctx.lineTo(x, y); ctx.stroke();
    dirty.current = true;
  };
  const end = () => { drawing.current = false; };
  const clear = () => { const c = ref.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); dirty.current = false; };

  // Parent reads the signature directly from the canvas at submit time.
  useImperativeHandle(apiRef, () => ({
    getDataURL: () => (dirty.current && ref.current ? ref.current.toDataURL('image/png') : ''),
    clear,
  }));

  return (
    <>
      <div className="vis-sign">
        <button type="button" className="vis-sign-clear" onClick={clear}>Clear</button>
        <canvas
          ref={ref}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        />
      </div>
      <div className="vis-sign-hint">Sign inside the box above using your mouse or touch screen.</div>
    </>
  );
});

/* ── Multi-select dropdown (chips + checklist) ─────────────────── */
function MultiSelect({ options, selected, onToggle, placeholder = 'Select employees…' }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const chosen = options.filter((o) => selected.includes(o.id));

  return (
    <div className="vis-ms" ref={boxRef}>
      <div className="vis-ms-display" role="button" tabIndex={0} onClick={() => setOpen((o) => !o)}>
        {chosen.length === 0
          ? <span className="vis-ms-ph">{placeholder}</span>
          : chosen.map((o) => <span key={o.id} className="vis-ms-chip">{o.name}</span>)}
        <span className="vis-ms-caret" aria-hidden="true">▾</span>
      </div>
      {open && (
        <div className="vis-ms-menu">
          {options.length === 0 ? (
            <div className="vis-ms-empty">No employees available.</div>
          ) : options.map((o) => (
            <label key={o.id} className="vis-ms-opt">
              <input type="checkbox" checked={selected.includes(o.id)} onChange={() => onToggle(o.id)} />
              {o.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VisitApplicationPage() {
  useDocumentTitle('Visit Application');
  const { client } = useAuth();
  const [tab, setTab] = useState('list');
  const [form, setForm] = useState(initialForm);
  const [staff, setStaff] = useState([]);
  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [visitsError, setVisitsError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'error' | 'success', text }
  const fileRef = useRef(null);
  const sigRef = useRef(null);

  useEffect(() => {
    let alive = true;
    employeeService.list().then((rows) => { if (alive) setStaff(rows); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const loadVisits = () => {
    setVisitsLoading(true);
    setVisitsError('');
    return visitService.list()
      .then((rows) => setVisits(rows))
      .catch((err) => setVisitsError(err?.message || 'Failed to load visit applications.'))
      .finally(() => setVisitsLoading(false));
  };

  useEffect(() => { loadVisits(); }, []);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleEmp = (name) => setForm((f) => {
    const set = new Set(f.employees || []);
    if (set.has(name)) set.delete(name); else set.add(name);
    return { ...f, employees: [...set] };
  });
  const reset = () => {
    setForm(initialForm());
    setMsg(null);
    sigRef.current?.clear();
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setMsg(null);
    setSubmitting(true);
    try {
      // Read the signature straight from the canvas at submit time.
      const signature = sigRef.current?.getDataURL() || '';
      await visitService.submit({ ...form, signature }, client?.id);
      reset();
      loadVisits();
      setTab('list');
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Could not submit the application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const cols = [
    { key: 'visitor',  header: 'Visitor' },
    { key: 'company',  header: 'Company' },
    { key: 'location', header: 'Location' },
    { key: 'date',     header: 'Date' },
    { key: 'time',     header: 'Time' },
    { key: 'purpose',  header: 'Purpose' },
    { key: 'duration', header: 'Duration' },
  ];

  return (
    <>
      <PageHeader title="Client Visit Application" />
      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'list' && (
        <Card bodyPadding={false}>
          {visitsLoading ? (
            <p style={{ padding: 20, color: 'var(--c-text-soft)' }}>Loading visit applications…</p>
          ) : visitsError ? (
            <p style={{ padding: 20, color: 'var(--c-danger)' }}>{visitsError}</p>
          ) : (
            <DataTable columns={cols} rows={visits} getRowKey={(r) => r.id} emptyText="No visit applications yet." />
          )}
        </Card>
      )}

      {tab === 'new' && (
        <Card title="New Visit Application">
          <div className="vis-banner">
            <span aria-hidden="true">ℹ️</span>
            <span>Submit a visit request when a client representative, HQ director, or external party plans to visit your team or office location.</span>
          </div>

          {/* Visitor Details */}
          <div className="vis-section-lbl">Visitor Details</div>
          <div className="form-row">
            <FormField label="Visitor Name" name="visitorName" required placeholder="Mr. Vincent Cheung"
              value={form.visitorName || ''} onChange={(e) => upd('visitorName', e.target.value)} />
            <FormField label="Company / Organization" name="company" required placeholder="Brighten HK"
              value={form.company || ''} onChange={(e) => upd('company', e.target.value)} />
          </div>
          <div className="form-row">
            <FormField label="Visitor Designation" name="designation" placeholder="Director"
              value={form.designation || ''} onChange={(e) => upd('designation', e.target.value)} />
            <FormField label="Contact Number" name="contact" placeholder="+852 9XXX XXXX"
              value={form.contact || ''} onChange={(e) => upd('contact', e.target.value)} />
          </div>

          {/* Visit Details */}
          <div className="vis-section-lbl">Visit Details</div>
          <div className="form-row">
            <FormField label="Visit Date" name="visitDate" required type="date"
              value={form.visitDate || ''} onChange={(e) => upd('visitDate', e.target.value)} />
            <FormField label="Visit Time" name="visitTime" required type="time"
              value={form.visitTime || ''} onChange={(e) => upd('visitTime', e.target.value)} />
          </div>
          <div className="form-row">
            <FormField label="Visit Location" name="location" required as="select" options={LOCATIONS}
              value={form.location || LOCATIONS[0]} onChange={(e) => upd('location', e.target.value)} />
            <FormField label="Expected Duration" name="duration" as="select" options={DURATIONS}
              value={form.duration || DURATIONS[1]} onChange={(e) => upd('duration', e.target.value)} />
          </div>
          <div className="form-row full">
            <FormField label="Purpose of Visit" name="purpose" required as="select" options={PURPOSES}
              value={form.purpose || PURPOSES[0]} onChange={(e) => upd('purpose', e.target.value)} />
          </div>

          <div className="form-field">
            <label>Employees Involved</label>
            <MultiSelect options={staff} selected={form.employees || []} onToggle={toggleEmp} />
          </div>

          <div className="form-row full">
            <FormField label="Special Requirements / Notes" name="notes" as="textarea" rows={3}
              placeholder="e.g. Conference room required, halal lunch needed, presentation setup…"
              value={form.notes || ''} onChange={(e) => upd('notes', e.target.value)} />
          </div>

          <div className="form-field">
            <label>Supporting Documents</label>
            <button type="button" className="vis-upload" onClick={() => fileRef.current?.click()}>
              <div className="vis-upload-ico" aria-hidden="true">📄</div>
              <div>{form.docName || 'Click to upload agenda or briefing document'}</div>
              <div className="vis-upload-sub">PDF, DOCX, JPG — max 5 MB</div>
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" hidden
              onChange={(e) => upd('docName', e.target.files?.[0]?.name || '')} />
          </div>

          {/* Office Policy */}
          <div className="vis-policy">
            <div className="vis-policy-hd">⚠ OFFICE POLICY — VISITOR NOTICE</div>
            <div className="vis-policy-body">
              <p>Please be advised that visitors are prohibited from performing the actions below in accordance with our office policy:</p>
              <div className="vis-policy-item"><b>(i)</b> Visitors are not allowed to take photos/videos of our office environment nor our colleagues' images.</div>
              <div className="vis-policy-item"><b>(ii)</b> The visitor is permitted entry to SeeWe premises solely for the purpose of attending a meeting or consultation arranged by the 'Client'.</div>
              <div className="vis-policy-item"><b>(iii)</b> SeeWe provides its office address and meeting rooms solely for the 'Client' to meet with visitor (third parties).</div>
              <div className="vis-policy-item"><b>(iv)</b> The visitor acknowledges and agrees that SeeWe's operation address does not represent the 'Client's company, nor does it serve as the 'Client's mailing address or business address.</div>
            </div>
          </div>

          <p className="vis-ack-intro">
            I hereby sign to confirm that the information provided above are accurate and agree to comply with the office policies stated above:
          </p>

          <div className="form-row">
            <FormField label="FULL NAME OF VISITOR" name="ackName" required placeholder="As per identification document"
              value={form.ackName || ''} onChange={(e) => upd('ackName', e.target.value)} />
            <FormField label="DATE OF ACKNOWLEDGEMENT" name="ackDate" required type="date"
              value={form.ackDate || ''} onChange={(e) => upd('ackDate', e.target.value)} />
          </div>

          <div className="form-field">
            <label>VISITOR SIGNATURE <span style={{ color: 'var(--c-danger)' }}>*</span></label>
            <SignaturePad ref={sigRef} />
          </div>

          {msg && (
            <div role="alert" style={{
              marginTop: 16, padding: '10px 14px', fontSize: 13, fontWeight: 600, borderRadius: 'var(--r-sm)',
              background: msg.type === 'error' ? 'var(--c-danger-bg)' : 'var(--c-success-bg)',
              border: `1px solid ${msg.type === 'error' ? 'var(--c-danger-border)' : 'var(--c-success-border)'}`,
              color: msg.type === 'error' ? 'var(--c-danger-dark)' : 'var(--c-success)',
            }}>{msg.text}</div>
          )}

          <div className="vis-footer">
            <Button variant="outline" onClick={reset} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting…' : '🖫 Submit Application'}</Button>
          </div>
        </Card>
      )}
    </>
  );
}
