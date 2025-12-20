import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../../features/auth/hooks'
import { useTeamMessageNotifications } from '../../hooks/useTeamMessageNotifications'

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'All Tasks', to: '/tasks' },
  { label: 'Teams', to: '/teams' },
  { label: 'Profile', to: '/profile' },
]

const WorkspaceHeader = () => {
  const navigate = useNavigate()
  const { mutate: logout, isPending } = useLogout()
  const { hasUnread } = useTeamMessageNotifications()

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => navigate('/', { replace: true }),
    })
  }

  return (
    <header className="bg-slate-100 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-slate-900">
            TaskFlow
          </Link>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Real-time workspaces</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `relative transition ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {link.label}
              {link.to === '/teams' && hasUnread && (
                <span className="absolute -right-3 top-1 h-2 w-2 rounded-full bg-rose-500" />
              )}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="rounded-full bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Signing out...' : 'Sign Out'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default WorkspaceHeader
