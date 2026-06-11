import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_STEPS, ROUTES } from '../../utils/constants.js';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps.jsx';
import Button from '../../components/Button/Button.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import CompanyInfoStep from './steps/CompanyInfoStep.jsx';
import ContactsStep from './steps/ContactsStep.jsx';
import HolidaysStep from './steps/HolidaysStep.jsx';
import BillingSetupStep from './steps/BillingSetupStep.jsx';
import ReviewStep from './steps/ReviewStep.jsx';
import './OnboardingPage.css';
import './steps/onboarding-steps.css';

const STEP_COMPONENTS = [
  CompanyInfoStep,
  ContactsStep,
  HolidaysStep,
  BillingSetupStep,
  ReviewStep,
];

export default function OnboardingPage() {
  useDocumentTitle('Onboarding');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const StepComponent = STEP_COMPONENTS[step - 1];

  const next = () => (step < ONBOARDING_STEPS.length ? setStep((s) => s + 1) : navigate(ROUTES.DASHBOARD));
  const back = () => step > 1 && setStep((s) => s - 1);

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <header className="ob-hd">
          <div className="ob-logo">SeeWe<span>Work</span></div>
          <div className="ob-step-lbl">Step {step} of {ONBOARDING_STEPS.length}</div>
        </header>

        <ProgressSteps steps={ONBOARDING_STEPS} current={step} />

        <StepComponent
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
        />

        <nav className="ob-nav">
          <Button variant="outline" onClick={back} disabled={step === 1}>← Back</Button>
          <Button onClick={next}>
            {step === ONBOARDING_STEPS.length ? 'Finish & Enter Portal' : 'Continue →'}
          </Button>
        </nav>
      </div>
    </div>
  );
}
