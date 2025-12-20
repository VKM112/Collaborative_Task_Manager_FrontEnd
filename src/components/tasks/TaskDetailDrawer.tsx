import { useEffect, useMemo, useState } from 'react'
import type { Status, Subtask, Task } from '../../features/tasks/types'
import Button from '../common/Button'

interface TaskDetailDrawerProps {
  task: Task
  onClose: () => void
  subtasks: Subtask[]
  onAddSubtask: (title: string) => void
  onEdit?: () => void
}

const TaskDetailDrawer = ({ task, onClose, subtasks, onAddSubtask, onEdit }: TaskDetailDrawerProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const [activeSubtask, setActiveSubtask] = useState<Subtask | null>(null)

  useEffect(() => {
    setActiveSubtask(null)
    setIsAdding(false)
    setNewSubtask('')
  }, [task.id, subtasks.length])

  const nextSubtasks = useMemo(
    () => (activeSubtask ? [activeSubtask, ...subtasks.filter((s) => s.id !== activeSubtask.id)] : subtasks),
    [activeSubtask, subtasks],
  )

  const handleAdd = () => {
    const trimmed = newSubtask.trim()
    if (!trimmed) return
    onAddSubtask(trimmed)
    setNewSubtask('')
    setIsAdding(false)
  }

  const priorityBadge = (value: Status) => {
    const map: Record<Status, string> = {
      ToDo: 'bg-slate-100 text-slate-700',
      InProgress: 'bg-indigo-100 text-indigo-700',
      Review: 'bg-amber-100 text-amber-700',
      Completed: 'bg-emerald-100 text-emerald-700',
    }
    return map[value]
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400"># TaskFlow</p>
            <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="ghost" className="text-xs uppercase tracking-[0.3em]" onClick={onEdit}>
                Edit
              </Button>
            )}
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 shadow-[0_6px_16px_rgba(148,163,184,0.45)] transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              onClick={onClose}
              aria-label="Close drawer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-slate-500">{task.description ?? 'No description yet.'}</p>
              {!isAdding && (
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-indigo-600"
                  onClick={() => setIsAdding(true)}
                >
                  + Add sub-task
                </button>
              )}
              {isAdding && (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    value={newSubtask}
                    onChange={(event) => setNewSubtask(event.target.value)}
                    placeholder="Sub-task title"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleAdd} disabled={!newSubtask.trim()} className="text-xs px-4 py-2">
                      Add task
                    </Button>
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                      onClick={() => {
                        setIsAdding(false)
                        setNewSubtask('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 p-3">
              {nextSubtasks.length === 0 && (
                <p className="text-sm text-slate-400">No subtasks yet. Add one above.</p>
              )}
              {nextSubtasks.map((subtask) => (
                <button
                  key={subtask.id}
                  type="button"
                  onClick={() => setActiveSubtask(subtask)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span className="font-medium">{subtask.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityBadge(subtask.status)}`}>
                    {subtask.status}
                  </span>
                </button>
              ))}
            </div>
            {activeSubtask && (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Subtask detail</p>
                    <h4 className="text-lg font-semibold text-slate-900">{activeSubtask.title}</h4>
                  </div>
                  <span className="text-xs text-slate-500">Status: {activeSubtask.status}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span>Priority</span>
                  <span>Labels</span>
                  <span>Reminders</span>
                </div>
                <p className="text-sm text-slate-500">
                  Opening a subtask gives a focused view with controls on the right-hand side.
                </p>
              </div>
            )}
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project</p>
              <p className="text-sm font-semibold text-slate-900">
                {task.creator.name} / {task.title}
              </p>
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Date</p>
              <p className="text-sm text-slate-600">Today</p>
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Deadline</p>
              <p className="text-sm text-slate-600">
                {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No deadline'}
              </p>
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Priority</p>
              <p className="text-sm font-semibold text-slate-900">{task.priority}</p>
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Labels</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-600">#focus</span>
                <span className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-600">#team</span>
              </div>
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reminders</p>
              <p className="text-sm text-slate-600">+ Add reminder</p>
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Location</p>
              <p className="text-sm text-slate-600">Not set</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailDrawer


