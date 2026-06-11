import { useEffect, useState } from 'react';
import AeField from '../AeField.jsx';
import ReportsToPicker from './ReportsToPicker.jsx';
import { employeeService } from '../../../../services/employeeService.js';

const CONTRACTS = ['— Select —', 'N/A (Full Time)', '1 Year (Contract Staff)', '2 Years (Contract Staff)', 'Part-Time', 'Internship'];
const NOTICE = ['— Select —', '2 weeks', '1 month', '2 months', '3 months'];

export default function EmploymentStep({ draft, set }) {
  const [people, setPeople] = useState([]);
  useEffect(() => { employeeService.list().then(setPeople); }, []);

  return (
    <>
      <h2 className="ae-section">Employment Details</h2>
      <p className="ae-sub">Role, contract and reporting structure.</p>

      <div className="ae-row2">
        <AeField label="Job Position / Title" required>
          <input type="text" placeholder="e.g. Software Engineer"
            value={draft.pos || ''} onChange={(e) => set({ pos: e.target.value })} />
        </AeField>
        <AeField label="Contract Type" required>
          <select value={draft.contract || CONTRACTS[0]} onChange={(e) => set({ contract: e.target.value })}>
            {CONTRACTS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Joined Date" required>
          <input type="date" value={draft.start || ''} onChange={(e) => set({ start: e.target.value })} />
        </AeField>
        <AeField label="Probation End Date">
          <input type="date" value={draft.probend || ''} onChange={(e) => set({ probend: e.target.value })} />
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Notice / Resign Period">
          <select value={draft.notice || NOTICE[0]} onChange={(e) => set({ notice: e.target.value })}>
            {NOTICE.map((n) => <option key={n}>{n}</option>)}
          </select>
        </AeField>
        <AeField label="Last Day / Contract End">
          <input type="date" value={draft.lastday || ''} onChange={(e) => set({ lastday: e.target.value })} />
        </AeField>
      </div>

      <AeField label="Reports To" hint="(select one or more)">
        <ReportsToPicker
          people={people}
          selected={draft.reportTo || []}
          onChange={(rt) => set({ reportTo: rt })}
        />
      </AeField>

      <AeField label="Resignation Letter">
        <div className="ae-file-box">
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => set({ resignLetter: e.target.files?.[0]?.name || '' })}
          />
          <span className="ae-file-hint">PDF, JPG or PNG accepted</span>
        </div>
      </AeField>
    </>
  );
}
