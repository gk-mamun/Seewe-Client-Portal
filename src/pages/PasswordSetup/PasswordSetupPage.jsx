import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './PasswordSetupPage.css';

const STEPS = [
  { n: 1, title: 'Enter Username',  sub: 'Your registered email' },
  { n: 2, title: 'Set Password',    sub: 'Create secure credentials' },
  { n: 3, title: 'Company Profile', sub: 'Verify company information' },
];

function strengthOf(pw) {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return s;
}

export default function PasswordSetupPage() {
  useDocumentTitle('Activate Account');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');

  const strength = useMemo(() => strengthOf(pw), [pw]);

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return setErr('Please enter a valid email.');
    setErr('');
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (pw.length < 8) return setErr('Password must be at least 8 characters.');
    if (pw !== pw2)    return setErr('Passwords do not match.');
    setErr('');
    setStep(3);
    setTimeout(() => navigate(ROUTES.ONBOARDING), 1200);
  };

  return (
    <div className="pw-setup-box">
      <aside className="pw-left">
        <div>
          <div className="pw-logo">SeeWe<span>Work</span></div>
          <div className="pw-tagline">Workforce Management System</div>
          <div className="pw-section-title">Account Activation</div>
          <p className="pw-section-desc">
            Complete the steps to activate your employer portal and verify your company profile.
          </p>
          <div className="pw-prog">
            <div className="pw-prog-fill" style={{ width: `${(step / STEPS.length) * 100}%` }} />
          </div>
          <ol className="pw-steps">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={`pw-step-row ${step === s.n ? 'active' : step > s.n ? 'done' : ''}`}
              >
                <span className="pw-step-dot">{step > s.n ? '✓' : s.n}</span>
                <div>
                  <div className="pw-step-txt">{s.title}</div>
                  <div className="pw-step-sub">{s.sub}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="pw-help">
          Need help? Contact your SeeWe Work account manager or email <strong>kloffice@seewe.work</strong>
        </div>
      </aside>

      <section className="pw-right">
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <h2>Set Up Your Account</h2>
            <p>Enter your registered username or email address to begin setting your password.</p>
            <div className="pw-field">
              <label htmlFor="pw-user">Username / Email Address</label>
              <input
                id="pw-user"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hr@yourcompany.com"
              />
            </div>
            {err && <div className="pw-err">{err}</div>}
            <button type="submit" className="lg-btn">Continue →</button>
            <div className="lg-link"><Link to={ROUTES.LOGIN}>← Back to Sign In</Link></div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2}>
            <h2>Create Your Password</h2>
            <p>Set a strong password for your portal account.</p>
            <div className="pw-field">
              <label htmlFor="pw-new">New Password</label>
              <input
                id="pw-new"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Minimum 8 characters"
              />
              <div className="pw-strength">
                {[1, 2, 3, 4].map((b) => (
                  <span
                    key={b}
                    className="pw-strength-bar"
                    style={{ background: strength >= b ? 'var(--c-success)' : 'var(--c-border)' }}
                  />
                ))}
              </div>
              <div className={`pw-req ${pw.length >= 8 ? 'ok' : ''}`}>
                ○ At least 8 characters
              </div>
            </div>
            <div className="pw-field">
              <label htmlFor="pw-confirm">Confirm Password</label>
              <input
                id="pw-confirm"
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>
            {err && <div className="pw-err">{err}</div>}
            <div className="pw-actions">
              <button type="button" className="lg-btn lg-btn-back" onClick={() => setStep(1)}>← Back</button>
              <button type="submit" className="lg-btn">Activate Account →</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="pw-success">
            <div className="pw-success-ico">✅</div>
            <h2>Account Activated!</h2>
            <p>Your credentials are set. Proceeding to company verification…</p>
            <div className="pw-spinner" />
          </div>
        )}
      </section>
    </div>
  );
}
