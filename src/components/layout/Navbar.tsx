import { useNavigate, Link } from 'react-router-dom'
import Button from '../common/Button'
import { useLogout, useProfile } from '../../features/auth/hooks'

const Navbar = () => {
  const navigate = useNavigate()
  const { data: profile } = useProfile()
  const { mutate: logout, isPending } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate('/'),
    })
  }

  return (
    <header className="border-b border-slate-200 bg-gradient-to-b from-slate-100 to-white px-4 py-4 shadow-sm sm:px-6">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-slate-900">
            TaskFlow
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Real-time workspaces</p>
          {profile?.name && <p className="text-xs text-slate-500">{`Hello, ${profile.name}`}</p>}
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 md:justify-end">
          <Link to="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:text-slate-900">
            Profile
          </Link>
          <Button variant="ghost" onClick={handleLogout} disabled={isPending}>
            {isPending ? 'Signing out...' : 'Sign out'}
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
