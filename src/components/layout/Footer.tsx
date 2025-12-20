import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col flex-wrap items-center justify-between gap-3 px-4 py-6 text-center text-sm text-slate-500 md:flex-row md:px-6 md:text-left">
        <p>Ac {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
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
