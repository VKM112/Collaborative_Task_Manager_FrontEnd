import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const features = [
  { title: 'Real-time task updates', description: 'See edits and comments from your team as they happen.' },
  { title: 'Assign tasks to teammates', description: 'Quickly delegate work to the right person with a couple of clicks.' },
  { title: 'Instant notifications', description: 'Never miss a due date or change with smart alerts.' },
  { title: 'Personal dashboards', description: 'Track your own workload and stay focused on the highest impact work.' },
  { title: 'Overdue task tracking', description: 'Spot blockers early and keep projects on schedule.' },
]

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex flex-1 max-w-6xl flex-col gap-16 px-6 py-12 md:py-20">
        <section className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-indigo-600">TaskFlow</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Manage Tasks. Collaborate in Real Time.
            </h1>
            <p className="text-lg text-slate-600">
              A real-time task management platform for teams and individuals. Coordinate work, avoid context
              switching, and ship outcomes together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="flex-1 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900/90 to-slate-800/80 p-8 text-white shadow-2xl transition duration-200 hover:scale-[1.01] md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Live Board</p>
            <h2 className="mt-4 text-2xl font-semibold">Team workload snapshot</h2>
            <p className="mt-2 text-sm text-slate-300">
              TaskFlow keeps every teammate in sync with real-time updates, so priorities never get lost.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <p>• 4 active team members</p>
              <p>• 18 tasks in progres</p>
              <p>• 5 overdue items</p>
              <p>• Notifications on for critical updates</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Features built for teams and solo makers</h3>
            <p className="text-sm text-slate-500">Flow from here → Sign Up or Login to continue</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-indigo-600">✅</p>
                <h4 className="text-lg font-semibold text-slate-900">{feature.title}</h4>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-slate-200 bg-indigo-600/5 p-10 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-indigo-500">Flow from here</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Ready to collaborate?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
            Click Sign Up to create your workspace, or Login if you already have an account. After that,
            the dashboard will be your command center for every project.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-indigo-600 px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Login
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
