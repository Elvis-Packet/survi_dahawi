import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from '@/redux/store';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Spinner from '@/components/common/Spinner';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RoleRoute from '@/routes/RoleRoute';
import AppLayout from '@/components/layout/AppLayout';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';

// Auth pages (eager — needed for first paint of login)
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Unauthorized from '@/pages/auth/Unauthorized';
import NotFound from '@/pages/auth/NotFound';

// Lazy-loaded role pages
const StaffDashboard = lazy(() => import('@/pages/staff/StaffDashboard'));
const StaffWeeklyPlans = lazy(() => import('@/pages/staff/StaffWeeklyPlans'));
const StaffActivities = lazy(() => import('@/pages/staff/StaffActivities'));
const StaffTasks = lazy(() => import('@/pages/staff/StaffTasks'));
const StaffPerformance = lazy(() => import('@/pages/staff/StaffPerformance'));
const StaffNotifications = lazy(() => import('@/pages/staff/StaffNotifications'));
const StaffProfile = lazy(() => import('@/pages/staff/StaffProfile'));

const ManagerDashboard = lazy(() => import('@/pages/manager/ManagerDashboard'));
const ManagerEmployees = lazy(() => import('@/pages/manager/ManagerEmployees'));
const ManagerWeeklyPlans = lazy(() => import('@/pages/manager/ManagerWeeklyPlans'));
const ManagerAssignTasks = lazy(() => import('@/pages/manager/ManagerAssignTasks'));
const ManagerVerification = lazy(() => import('@/pages/manager/ManagerVerification'));
const ManagerReports = lazy(() => import('@/pages/manager/ManagerReports'));
const ManagerNotifications = lazy(() => import('@/pages/manager/ManagerNotifications'));
const ManagerProfile = lazy(() => import('@/pages/manager/ManagerProfile'));

const CeoDashboard = lazy(() => import('@/pages/ceo/CeoDashboard'));
const CeoUsers = lazy(() => import('@/pages/ceo/CeoUsers'));
const CeoDepartments = lazy(() => import('@/pages/ceo/CeoDepartments'));
const CeoReports = lazy(() => import('@/pages/ceo/CeoReports'));
const CeoAuditLogs = lazy(() => import('@/pages/ceo/CeoAuditLogs'));
const CeoLoginHistory = lazy(() => import('@/pages/ceo/CeoLoginHistory'));
const CeoOrgAnalytics = lazy(() => import('@/pages/ceo/CeoOrgAnalytics'));
const CeoSettings = lazy(() => import('@/pages/ceo/CeoSettings'));
const CeoNotifications = lazy(() => import('@/pages/ceo/CeoNotifications'));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

              {/* Protected — Staff */}
              <Route element={<ProtectedRoute><RoleRoute allowedRoles={[ROLES.STAFF, ROLES.MANAGER, ROLES.CEO]}><AppLayout /></RoleRoute></ProtectedRoute>}>
                <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboard />} />
                <Route path={ROUTES.STAFF_WEEKLY_PLANS} element={<StaffWeeklyPlans />} />
                <Route path={ROUTES.STAFF_ACTIVITIES} element={<StaffActivities />} />
                <Route path={ROUTES.STAFF_TASKS} element={<StaffTasks />} />
                <Route path={ROUTES.STAFF_PERFORMANCE} element={<StaffPerformance />} />
                <Route path={ROUTES.STAFF_NOTIFICATIONS} element={<StaffNotifications />} />
                <Route path={ROUTES.STAFF_PROFILE} element={<StaffProfile />} />
              </Route>

              {/* Protected — Manager */}
              <Route element={<ProtectedRoute><RoleRoute allowedRoles={[ROLES.MANAGER, ROLES.CEO]}><AppLayout /></RoleRoute></ProtectedRoute>}>
                <Route path={ROUTES.MANAGER_DASHBOARD} element={<ManagerDashboard />} />
                <Route path={ROUTES.MANAGER_EMPLOYEES} element={<ManagerEmployees />} />
                <Route path={ROUTES.MANAGER_WEEKLY_PLANS} element={<ManagerWeeklyPlans />} />
                <Route path={ROUTES.MANAGER_ASSIGN_TASKS} element={<ManagerAssignTasks />} />
                <Route path={ROUTES.MANAGER_VERIFICATION} element={<ManagerVerification />} />
                <Route path={ROUTES.MANAGER_REPORTS} element={<ManagerReports />} />
                <Route path={ROUTES.MANAGER_NOTIFICATIONS} element={<ManagerNotifications />} />
                <Route path={ROUTES.MANAGER_PROFILE} element={<ManagerProfile />} />
              </Route>

              {/* Protected — CEO */}
              <Route element={<ProtectedRoute><RoleRoute allowedRoles={[ROLES.CEO]}><AppLayout /></RoleRoute></ProtectedRoute>}>
                <Route path={ROUTES.CEO_DASHBOARD} element={<CeoDashboard />} />
                <Route path={ROUTES.CEO_USERS} element={<CeoUsers />} />
                <Route path={ROUTES.CEO_DEPARTMENTS} element={<CeoDepartments />} />
                <Route path={ROUTES.CEO_REPORTS} element={<CeoReports />} />
                <Route path={ROUTES.CEO_AUDIT_LOGS} element={<CeoAuditLogs />} />
                <Route path={ROUTES.CEO_LOGIN_HISTORY} element={<CeoLoginHistory />} />
                <Route path={ROUTES.CEO_ORG_ANALYTICS} element={<CeoOrgAnalytics />} />
                <Route path={ROUTES.CEO_SETTINGS} element={<CeoSettings />} />
                <Route path={ROUTES.CEO_NOTIFICATIONS} element={<CeoNotifications />} />
              </Route>

              {/* Fallbacks */}
              <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3500} hideProgressBar newestOnTop closeOnClick pauseOnHover theme="colored" />
      </ErrorBoundary>
    </Provider>
  );
}
