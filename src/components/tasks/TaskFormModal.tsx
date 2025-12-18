import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import type { CreateTaskInput, Priority, Status, Task } from '../../features/tasks/types'
import type { User } from '../../features/auth/types'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateTaskInput) => void
  isSaving?: boolean
  members: User[]
  currentUser?: User | null
  editingTask?: Task | null
  teamName?: string
}

type AssignOption = {
  id: string
  label: string
  email?: string
}

const priorityOptions: Priority[] = ['Low', 'Medium', 'High', 'Urgent']
const statusOptions: Status[] = ['ToDo', 'InProgress', 'Review', 'Completed']

const formatDateForInput = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - timezoneOffset)
  return localDate.toISOString().slice(0, 16)
}

const TaskFormModal = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  members,
  currentUser,
  editingTask,
  teamName,
}: TaskFormModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [status, setStatus] = useState<Status>('ToDo')
  const [assignedToId, setAssignedToId] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [assignOpen, setAssignOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(event.target as Node)) {
        setAssignOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    setErrors({})
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description ?? '')
      setDueDate(formatDateForInput(editingTask.dueDate))
      setPriority(editingTask.priority)
      setStatus(editingTask.status)
      setAssignedToId(editingTask.assignedToId ?? currentUser?.id ?? '')
    } else {
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('Medium')
      setStatus('ToDo')
      setAssignedToId(currentUser?.id ?? '')
    }
  }, [editingTask, currentUser, isOpen])

  const assignOptions: AssignOption[] = useMemo(() => {
    return members
      .filter((member) => member.id !== currentUser?.id)
      .map((user) => ({
        id: user.id,
        label: user.name,
        email: user.email,
      }))
  }, [members, currentUser])

  const filteredAssignOptions = useMemo(() => {
    if (!searchTerm) return assignOptions
    const term = searchTerm.toLowerCase()
    return assignOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        (option.email?.toLowerCase().includes(term) ?? false),
    )
  }, [assignOptions, searchTerm])

  const selectedAssignee = assignOptions.find((option) => option.id === assignedToId)

  const assignmentMessage = useMemo(() => {
    if (assignedToId && currentUser && assignedToId === currentUser.id) {
      return 'You will be responsible for this task.'
    }
    if (!selectedAssignee) return 'Assign this task to someone from your workspace.'
    return `This task will be assigned to ${selectedAssignee.label}.`
  }, [selectedAssignee, currentUser, assignedToId])

  const displayAssignLabel =
    selectedAssignee?.label || (assignedToId === currentUser?.id ? 'You (assigned)' : 'Select user')

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {}
    if (!title.trim()) {
      nextErrors.title = 'Title is required.'
    } else if (title.trim().length > 100) {
      nextErrors.title = 'Title must be 100 characters or less.'
    }

    if (!priority) {
      nextErrors.priority = 'Set a priority.'
    }

    if (!status) {
      nextErrors.status = 'Set a status.'
    }

    if (!assignedToId) {
      nextErrors.assignedToId = 'Select a teammate.'
    }

    if (dueDate) {
      const parsed = new Date(dueDate)
      if (Number.isNaN(parsed.getTime())) {
        nextErrors.dueDate = 'Enter a valid due date.'
      } else if (parsed <= new Date()) {
        nextErrors.dueDate = 'Due date must be in the future.'
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
      status,
      assignedToId,
    }

    onSave(payload)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingTask ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Assign responsibility</p>
          {teamName && (
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.25em] text-indigo-500">
              Team: {teamName}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">Title</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Fix login bug"
              required
              className="mt-2"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what needs to happen"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Assign To</label>
            <div ref={dropdownRef} className="relative mt-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={() => setAssignOpen((prev) => !prev)}
              >
                <span>{displayAssignLabel}</span>
                <span className="text-xs text-slate-400">▼</span>
              </button>
              {assignOpen && (
                <div className="absolute inset-x-0 top-full mt-2 max-h-60 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Type a teammate"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-auto">
                    {filteredAssignOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`flex w-full items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 ${
                          option.id === selectedAssignee?.id ? 'bg-indigo-50 text-indigo-600' : ''
                        }`}
                        onClick={() => {
                          setAssignedToId(option.id)
                          setAssignOpen(false)
                          setSearchTerm('')
                        }}
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{option.label}</span>
                          {option.email && <span className="text-[11px] text-slate-500">{option.email}</span>}
                        </div>
                        {option.id === selectedAssignee?.id && (
                          <span className="text-xs text-indigo-500">Selected</span>
                        )}
                      </button>
                    ))}
                    {!filteredAssignOptions.length && (
                      <p className="px-3 py-2 text-sm text-slate-500">No teammates match.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.assignedToId && (
              <p className="mt-1 text-xs text-rose-600">{errors.assignedToId}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">{assignmentMessage}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-800">Due Date</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.dueDate && <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Priority</label>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.priority && <p className="mt-1 text-xs text-rose-600">{errors.priority}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-xs text-rose-600">{errors.status}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="px-4 py-2 text-sm">
            {isSaving ? 'Saving…' : editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TaskFormModal
