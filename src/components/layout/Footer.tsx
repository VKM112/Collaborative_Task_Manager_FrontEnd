import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-slate-900">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-slate-900">
            Terms
          </Link>
          <Link to="/support" className="hover:text-slate-900">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
