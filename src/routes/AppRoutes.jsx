import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import AuthLayout from '../layouts/AuthLayout'
import AppLayout from '../layouts/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import DashboardPage from '../pages/DashboardPage'
import TeamPage from '../pages/TeamPage'
import ProjectPage from '../pages/ProjectPage'
import KanbanPage from '../pages/KanbanPage'
import { isAuthenticated } from '../utils/auth'

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}

function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.signup} element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.team} element={<TeamPage />} />
          <Route path={ROUTES.project} element={<ProjectPage />} />
          <Route path={ROUTES.kanban} element={<KanbanPage />} />
        </Route>
      </Route>

      <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  )
}
