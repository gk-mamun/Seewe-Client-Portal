import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth.jsx';
import RequireCompanyComplete from './RequireCompanyComplete.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ClientLayout from '../layouts/ClientLayout.jsx';

import LoginPage from '../pages/Login/LoginPage.jsx';
import PasswordSetupPage from '../pages/PasswordSetup/PasswordSetupPage.jsx';
import OnboardingPage from '../pages/Onboarding/OnboardingPage.jsx';

import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import EmployeesPage from '../pages/Employees/EmployeesPage.jsx';
import AddEmployeePage from '../pages/Employees/AddEmployeePage.jsx';
import EmployeeProfilePage from '../pages/EmployeeProfile/EmployeeProfilePage.jsx';
import LeaveReportPage from '../pages/Leave/LeaveReportPage.jsx';
import VisitApplicationPage from '../pages/Visit/VisitApplicationPage.jsx';
import ClaimsPage from '../pages/Claims/ClaimsPage.jsx';
import CompanySettingsPage from '../pages/Company/CompanySettingsPage.jsx';
import SeeweContactPage from '../pages/SeeweContact/SeeweContactPage.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';

import { ROUTES } from '../utils/constants.js';

/**
 * Small helper — combines auth + company-completeness for routes that
 * should be hidden until the profile is filled in.
 */
const Gated = ({ children }) => (
  <RequireAuth>
    <RequireCompanyComplete>{children}</RequireCompanyComplete>
  </RequireAuth>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public auth routes ────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.PW_SETUP} element={<PasswordSetupPage />} />
      </Route>

      {/* ── Onboarding (auth only) ────────────────────────── */}
      <Route
        path={ROUTES.ONBOARDING}
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />

      {/* ── Authenticated app shell ───────────────────────── */}
      <Route
        element={
          <RequireAuth>
            <ClientLayout />
          </RequireAuth>
        }
      >
        {/*  Company is reachable even when the profile is incomplete —
            it's where the user fills the required fields. */}
        <Route path={ROUTES.COMPANY} element={<CompanySettingsPage />} />

        {/*  Every other route requires a completed profile. */}
        <Route path={ROUTES.DASHBOARD}       element={<Gated><DashboardPage /></Gated>} />
        <Route path={ROUTES.EMPLOYEES}       element={<Gated><EmployeesPage /></Gated>} />
        <Route path={ROUTES.EMPLOYEE_NEW}    element={<Gated><AddEmployeePage /></Gated>} />
        <Route path={ROUTES.EMPLOYEE_DETAIL} element={<Gated><EmployeeProfilePage /></Gated>} />
        <Route path={ROUTES.LEAVE}           element={<Gated><LeaveReportPage /></Gated>} />
        <Route path={ROUTES.VISITS}          element={<Gated><VisitApplicationPage /></Gated>} />
        <Route path={ROUTES.CLAIMS}          element={<Gated><ClaimsPage /></Gated>} />
        <Route path={ROUTES.CONTACT}         element={<Gated><SeeweContactPage /></Gated>} />
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
