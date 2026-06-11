import AeField from '../AeField.jsx';

export default function SalaryStep({ draft, set }) {
  return (
    <>
      <h2 className="ae-section">Salary &amp; Allowances</h2>
      <p className="ae-sub">Monthly compensation in MYR. All fields are estimates — adjustable later.</p>

      <div className="ae-row2">
        <AeField label="Base Salary (MYR)" required>
          <input type="number" placeholder="e.g. 5000"
            value={draft.base || ''} onChange={(e) => set({ base: e.target.value })} />
        </AeField>
        <AeField label="Allowance (MYR)">
          <input type="number" placeholder="e.g. 500"
            value={draft.housing || ''} onChange={(e) => set({ housing: e.target.value })} />
        </AeField>
      </div>

      <div className="ae-row2">
        <AeField label="Transport Allowance (MYR)">
          <input type="number" placeholder="e.g. 300"
            value={draft.transport || ''} onChange={(e) => set({ transport: e.target.value })} />
        </AeField>
        <AeField label="Employer MPF Est. (MYR)">
          <input type="number" placeholder="e.g. 250"
            value={draft.mpf || ''} onChange={(e) => set({ mpf: e.target.value })} />
        </AeField>
      </div>

      <div className="ae-note ae-note--amber">
        📌 Employer MPF is estimated at 5% of basic salary, capped at HKD 1,500/month.
        Final amount confirmed by SeeWe Work.
      </div>
    </>
  );
}
