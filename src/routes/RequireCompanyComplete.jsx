import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../utils/constants.js';

/**
 * Wraps every authenticated page except `/company`. If the client's
 * profile is missing any required field (company_name, company_address,
 * country, email), they're redirected to /company and can't reach other
 * routes until those fields are filled in.
 */
export default function RequireCompanyComplete({ children }) {
  const { isCompanyComplete, companyChecked } = useAuth();
  // Wait for the /client/details check before deciding — otherwise a complete
  // profile would be bounced to /company while the check is still loading.
  if (!companyChecked) {
    return <p style={{ padding: 24, color: 'var(--c-text-soft)' }}>Loading…</p>;
  }
  if (!isCompanyComplete) {
    return <Navigate to={ROUTES.COMPANY} replace />;
  }
  return children;
}
