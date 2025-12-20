import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'
import AllTasksPage from './pages/AllTasksPage'
import TeamsPage from './pages/TeamsPage'
import { useProfile } from './features/auth/hooks'

type GuardProps = {
  children: ReactNode
}

const LoadingScreen = () => <div className="min-h-screen bg-slate-50" />

const RequireAuth = ({ children }: GuardProps) => {
  const { data: profile, isLoading, isError } = useProfile()

  if (isLoading) return <LoadingScreen />
  if (isError || !profile) return <Navigate to="/login" replace />
  return children
}

const RedirectIfAuth = ({ children }: GuardProps) => {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) return <LoadingScreen />
  if (profile) return <Navigate to="/dashboard" replace />
  return children
}

export const router = createBrowserRouter([
  { path: '/', element: <RedirectIfAuth><LandingPage /></RedirectIfAuth> },
  { path: '/login', element: <RedirectIfAuth><LoginPage /></RedirectIfAuth> },
  { path: '/register', element: <RedirectIfAuth><RegisterPage /></RedirectIfAuth> },
  { path: '/dashboard', element: <RequireAuth><DashboardPage /></RequireAuth> },
  { path: '/tasks', element: <RequireAuth><AllTasksPage /></RequireAuth> },
  { path: '/teams', element: <RequireAuth><TeamsPage /></RequireAuth> },
  { path: '/profile', element: <RequireAuth><ProfilePage /></RequireAuth> },
  { path: '*', element: <Navigate to="/" replace /> },
])
