import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-full space-y-4 border-b border-slate-200 bg-slate-50 px-5 py-6 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</div>
      <ul className="space-y-2 text-sm text-slate-700">
        <li>
          <Link to="/dashboard" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/tasks" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            All Tasks
          </Link>
        </li>
        <li>
          <Link to="/teams" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            Teams
          </Link>
        </li>
        <li>
          <Link to="/profile" className="block rounded-lg px-3 py-2 hover:bg-white hover:text-slate-900">
            Profile
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
