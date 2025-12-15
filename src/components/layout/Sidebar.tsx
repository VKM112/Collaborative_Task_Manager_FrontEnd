import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 space-y-4 border-r border-slate-200 bg-slate-50 px-5 py-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</div>
      <ul className="space-y-2 text-sm text-slate-700">
        <li>
          <Link to="/" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            Profile
          </Link>
        </li>
        <li>
          <Link to="#" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            Teams
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
