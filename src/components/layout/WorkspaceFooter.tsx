import { Link } from 'react-router-dom'

const WorkspaceFooter = () => {
  return (
    <footer className="mt-auto bg-white/60 px-4 py-6 text-xs uppercase tracking-[0.2em] text-slate-500">
      <div className="flex flex-col flex-wrap items-center justify-between gap-3 text-center md:flex-row md:text-left">
        <span>Ac {new Date().getFullYear()} TaskFlow</span>
        <div className="flex flex-wrap gap-4 text-[0.7rem]">
          <Link className="hover:text-slate-800" to="/terms">
            Terms
          </Link>
          <Link className="hover:text-slate-800" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-slate-800" to="/support">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default WorkspaceFooter
