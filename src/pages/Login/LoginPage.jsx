import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../utils/constants.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './LoginPage.css';

export default function LoginPage() {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('demo@brightentechnology.com');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate(ROUTES.DASHBOARD);
  };

  const handleDemo = async () => {
    await demoLogin();
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <form className="lg-box" onSubmit={handleSubmit}>
      <div className="lg-logo">SeeWe<span>Work</span></div>
      <div className="lg-sub">Workforce Management System</div>

      <label htmlFor="lg-user">Username / Email</label>
      <input
        id="lg-user"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <label htmlFor="lg-pw">Password</label>
      <input
        id="lg-pw"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <button type="submit" className="lg-btn">Sign In</button>

      <div className="lg-divider">
        <hr />
        <span>or try demo</span>
        <hr />
      </div>

      <div className="lg-demo">
        <div className="lg-demo-hd">🎁 Demo Credentials</div>
        <div className="lg-demo-grid">
          <div>
            <div className="lg-demo-lbl">Username</div>
            <code>demo@brightentechnology.com</code>
          </div>
          <div>
            <div className="lg-demo-lbl">Password</div>
            <code>demo1234</code>
          </div>
        </div>
        <button type="button" className="lg-btn lg-btn-demo" onClick={handleDemo}>
          ▶ Launch Demo Portal
        </button>
      </div>

      <div className="lg-link">
        First time? <Link to={ROUTES.PW_SETUP}>Activate your account</Link>
      </div>
    </form>
  );
}
