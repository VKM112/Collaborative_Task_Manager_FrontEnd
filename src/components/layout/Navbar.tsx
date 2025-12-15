import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <Link to="/" className="text-xl font-semibold text-slate-900">
        TaskManager
      </Link>
      <nav className="flex items-center gap-4 text-sm text-slate-600">
        <Link to="/" className="hover:text-slate-900">
          Dashboard
        </Link>
        <Link to="/profile" className="hover:text-slate-900">
          Profile
        </Link>
        <Link to="/login" className="hover:text-slate-900">
          Sign out
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
