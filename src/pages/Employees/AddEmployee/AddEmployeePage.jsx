import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants.js';
import useDocumentTitle from '../../../hooks/useDocumentTitle.js';

import StepperSidebar from './StepperSidebar.jsx';
import StepFooter from './StepFooter.jsx';

import BasicInfoStep    from './steps/BasicInfoStep.jsx';
import EmploymentStep   from './steps/EmploymentStep.jsx';
import SalaryStep       from './steps/SalaryStep.jsx';
import WorkScheduleStep from './steps/WorkScheduleStep.jsx';
import DocumentsStep    from './steps/DocumentsStep.jsx';

import './AddEmployeePage.css';

const STEPS = [
  { n: 1, lbl: 'Basic Info',    sub: 'Personal details' },
  { n: 2, lbl: 'Employment',    sub: 'Role & contract' },
  { n: 3, lbl: 'Salary',        sub: 'Compensation' },
  { n: 4, lbl: 'Work Schedule', sub: 'Hours & arrangement' },
  { n: 5, lbl: 'Documents',     sub: 'Upload letters' },
];

const STEP_COMPONENTS = {
  1: BasicInfoStep,
  2: EmploymentStep,
  3: SalaryStep,
  4: WorkScheduleStep,
  5: DocumentsStep,
};

export default function AddEmployeePage() {
  useDocumentTitle('Add Employee');
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  const set = (patch) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDraftSaved(true);
  };

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <>
      <header className="ae-page-hd">
        <Link to={ROUTES.EMPLOYEES} className="btn bol ae-back-btn">← Back</Link>
        <h1>Add New Employee</h1>
        {draftSaved && <span className="ae-draft-badge">📋 Draft saved</span>}
      </header>

      <div className="ae-wrap">
        <StepperSidebar steps={STEPS} current={step} onJump={setStep} />

        <section className="ae-right">
          <StepComponent draft={draft} set={set} />

          <StepFooter
            isFirst={step === 1}
            isLast={step === STEPS.length}
            onCancel={() => navigate(ROUTES.EMPLOYEES)}
            onBack={() => setStep((s) => Math.max(1, s - 1))}
            onSaveDraft={() => setDraftSaved(true)}
            onContinue={() => setStep((s) => Math.min(STEPS.length, s + 1))}
            onSubmit={() => navigate(ROUTES.EMPLOYEES)}
          />
        </section>
      </div>
    </>
  );
}
