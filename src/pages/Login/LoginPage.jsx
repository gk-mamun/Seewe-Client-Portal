import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../utils/constants.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './LoginPage.css';

export default function LoginPage() {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState(location.state?.notice || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError('');
    setNotice('');
    setSubmitting(true);

    try {
      const client = await login({ username: username.trim(), password });
      const requiredOk = ['company_name', 'company_address', 'country', 'email']
        .every((f) => String(client?.[f] ?? '').trim() !== '');

      // If profile is incomplete, jump straight to the Company page
      // (the route guard will also enforce this).
      const dest = !requiredOk
        ? ROUTES.COMPANY
        : (location.state?.from?.pathname || ROUTES.DASHBOARD);

      navigate(dest, { replace: true });
    } catch (err) {
      setError(err?.message || 'Sign-in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="lg-box" onSubmit={handleSubmit} noValidate>
      <div className="lg-logo">SeeWe<span>Work</span></div>
      <div className="lg-sub">Workforce Management System</div>

      <label htmlFor="lg-user">Username</label>
      <input
        id="lg-user"
        type="text"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your username"
        disabled={submitting}
        required
      />

      <label htmlFor="lg-pw">Password</label>
      <input
        id="lg-pw"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        disabled={submitting}
        required
      />

      {notice && <div className="lg-notice" role="status">{notice}</div>}
      {error && <div className="lg-error" role="alert">{error}</div>}

      <button type="submit" className="lg-btn" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign In'}
      </button>

      <div className="lg-link">
        First time? <Link to={ROUTES.PW_SETUP}>Activate your account</Link>
      </div>
    </form>
  );
}
