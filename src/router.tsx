import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
