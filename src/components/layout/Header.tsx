import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-slate-100 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <div className="text-xl font-semibold tracking-tight text-slate-900">TaskFlow</div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Real-time workspaces</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link to="/login" className="rounded-full px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
