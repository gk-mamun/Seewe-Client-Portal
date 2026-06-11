import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth.jsx';
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.PW_SETUP} element={<PasswordSetupPage />} />
      </Route>

      {/* Onboarding lives at its own URL — also auth-gated */}
      <Route
        path={ROUTES.ONBOARDING}
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />

      {/* Authenticated app shell */}
      <Route
        element={
          <RequireAuth>
            <ClientLayout />
          </RequireAuth>
        }
      >
        <Route path={ROUTES.DASHBOARD}        element={<DashboardPage />} />
        <Route path={ROUTES.EMPLOYEES}        element={<EmployeesPage />} />
        <Route path={ROUTES.EMPLOYEE_NEW}     element={<AddEmployeePage />} />
        <Route path={ROUTES.EMPLOYEE_DETAIL}  element={<EmployeeProfilePage />} />
        <Route path={ROUTES.LEAVE}            element={<LeaveReportPage />} />
        <Route path={ROUTES.VISITS}           element={<VisitApplicationPage />} />
        <Route path={ROUTES.CLAIMS}           element={<ClaimsPage />} />
        <Route path={ROUTES.COMPANY}          element={<CompanySettingsPage />} />
        <Route path={ROUTES.CONTACT}          element={<SeeweContactPage />} />
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
