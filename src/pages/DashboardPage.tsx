import { useState } from 'react'
import { TaskList } from '../components/tasks/TaskList'
import type { Priority, Status, TaskFilters } from '../features/tasks/types'
import { useTasks } from '../features/tasks/hooks'

const statusOptions: { label: string; value?: Status }[] = [
  { label: 'All', value: undefined },
  { label: 'To Do', value: 'ToDo' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Review', value: 'Review' },
  { label: 'Completed', value: 'Completed' },
]

const priorityOptions: { label: string; value?: Priority }[] = [
  { label: 'All', value: undefined },
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Urgent', value: 'Urgent' },
]

const headerLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
]

export default function DashboardPage() {
  const [status, setStatus] = useState<Status | undefined>()
  const [priority, setPriority] = useState<Priority | undefined>()
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt'>('dueDate')
  const [tab, setTab] = useState<'assignedToMe' | 'createdByMe' | 'all' | 'overdue'>(
    'assignedToMe',
  )

  const filters: TaskFilters = {
    status,
    priority,
    sortBy,
    assignedToMe: tab === 'assignedToMe',
    createdByMe: tab === 'createdByMe',
    overdue: tab === 'overdue',
  }

  const { data: tasks = [], isLoading } = useTasks(filters)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-100 px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">TaskFlow</h1>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Real-time workspaces</p>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            {headerLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-slate-900">
                {link.label}
              </a>
            ))}
            <a className="rounded-full bg-slate-900 px-5 py-2 text-white" href="/logout">
              Sign Out
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 md:px-6">
        <section className="bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-500">TaskFlow</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage your work</h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep tasks, teammates, and priorities in sync. Use the filters below to align the view.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Assigned to me', 'Created by me', 'All tasks', 'Overdue'].map((label, idx) => (
              <button
                key={label}
                onClick={() => setTab(['assignedToMe', 'createdByMe', 'all', 'overdue'][idx] as typeof tab)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  tab === ['assignedToMe', 'createdByMe', 'all', 'overdue'][idx]
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {[
              { label: 'Status', setter: setStatus, value: status, options: statusOptions },
              { label: 'Priority', setter: setPriority, value: priority, options: priorityOptions },
              { label: 'Sort by', setter: setSortBy, value: sortBy, options: [{ label: 'Due date', value: 'dueDate' }, { label: 'Created at', value: 'createdAt' }] },
            ].map((filter) => (
              <div key={filter.label}>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">{filter.label}</label>
                <select
                  value={filter.value ?? ''}
                  onChange={(e) => {
                    const next = e.target.value || undefined
                    filter.setter(next as any)
                  }}
                  className="mt-2 w-40 rounded border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {filter.options.map((opt) => (
                    <option key={opt.label} value={opt.value ?? ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <TaskList tasks={tasks} isLoading={isLoading} emptyMessage="No tasks match the current filters." />
        </section>
      </main>

      <footer className="mt-auto bg-white/60 px-4 py-6 text-xs uppercase tracking-[0.2em] text-slate-500">
        <div className="flex flex-wrap justify-between gap-3">
            <span>© {new Date().getFullYear()} TaskFlow</span>
            <div className="flex flex-wrap gap-4 text-[0.7rem]">
              <a className="hover:text-slate-800" href="/terms">
                Terms
              </a>
              <a className="hover:text-slate-800" href="/privacy">
                Privacy
              </a>
              <a className="hover:text-slate-800" href="/support">
                Support
              </a>
            </div>
          </div>
        </footer>
    </div>
  )
}
