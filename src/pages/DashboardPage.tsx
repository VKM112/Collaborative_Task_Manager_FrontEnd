import { useEffect, useMemo, useState } from 'react'
import Button from '../components/common/Button'
import { TaskList } from '../components/tasks/TaskList'
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer'
import TaskFormModal from '../components/tasks/TaskFormModal'
import TeamSidebar from '../components/teams/TeamSidebar'
import TeamChatPanel from '../components/teams/TeamChatPanel'
import { useCreateTask, useTasks, useUpdateTask } from '../features/tasks/hooks'
import type {
  CreateTaskInput,
  Priority,
  Status,
  Subtask,
  Task,
  TaskFilters,
  TaskFormPayload,
} from '../features/tasks/types'
import { useProfile } from '../features/auth/hooks'
import type { User } from '../features/auth/types'
import { useCreateTeam, useJoinTeam, useTeams, useTeamMembers } from '../features/teams/hooks'
import { useCreateTeamMessage, useTeamMessages } from '../features/chat/hooks'
import { useTeamChatSocket } from '../hooks/useTeamChatSocket'

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

const tabLabels = [
  { label: 'Assigned to me', value: 'assignedToMe' },
  { label: 'Created by me', value: 'createdByMe' },
  { label: 'All tasks', value: 'all' },
  { label: 'Overdue', value: 'overdue' },
] as const

export default function DashboardPage() {
  const [status, setStatus] = useState<Status | undefined>()
  const [priority, setPriority] = useState<Priority | undefined>()
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt'>('dueDate')
  const [tab, setTab] = useState<(typeof tabLabels)[number]['value']>('assignedToMe')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [subtasksByTask, setSubtasksByTask] = useState<Record<string, Subtask[]>>({})
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [teamAlert, setTeamAlert] = useState<string | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)

  const { data: profile } = useProfile()
  const { data: teams = [], isLoading: teamsLoading } = useTeams(!!profile)
  const createTeamMutation = useCreateTeam()
  const joinTeamMutation = useJoinTeam()
  const isCreatingTeam = createTeamMutation.isPending
  const isJoiningTeam = joinTeamMutation.isPending
  const createTeamError = createTeamMutation.error
  const joinTeamError = joinTeamMutation.error

  useEffect(() => {
    if (!selectedTeamId && teams.length) {
      setSelectedTeamId(teams[0].id)
      return
    }
    if (selectedTeamId && !teams.find((team) => team.id === selectedTeamId)) {
      setSelectedTeamId(teams[0]?.id ?? null)
    }
  }, [teams, selectedTeamId])

  const selectedTeam = useMemo(() => {
    return teams.find((team) => team.id === selectedTeamId) ?? null
  }, [teams, selectedTeamId])

  const teamMembers = useTeamMembers(selectedTeamId ?? undefined, !!selectedTeamId)
  const memberUsers = useMemo<User[]>(() => {
    return (teamMembers.data ?? []).map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
    }))
  }, [teamMembers.data])

  const membership = (teamMembers.data ?? []).find((member) => member.userId === profile?.id)
  const currentRole = membership?.role ?? 'MEMBER'

  const queryFilters = useMemo<TaskFilters | null>(() => {
    if (!selectedTeamId) return null
    const filters: TaskFilters = {
      teamId: selectedTeamId,
      status,
      priority,
      sortBy,
    }

    if (tab === 'assignedToMe' && profile?.id) {
      filters.assignedToId = profile.id
    }
    if (tab === 'createdByMe' && profile?.id) {
      filters.creatorId = profile.id
    }
    if (tab === 'overdue') {
      filters.overdue = true
    }
    return filters
  }, [priority, selectedTeamId, sortBy, status, tab, profile?.id])

  const { data: tasks = [], isLoading: tasksLoading } = useTasks(queryFilters ?? undefined, !!queryFilters && !!profile)

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const createTask = createTaskMutation.mutate
  const updateTask = updateTaskMutation.mutate
  const isCreatingTask = createTaskMutation.isPending
  const isUpdatingTask = updateTaskMutation.isPending

  const isSavingTask = isCreatingTask || isUpdatingTask

  const closeDetail = () => setDetailTask(null)
  const closeModal = () => {
    setEditingTask(null)
    setIsModalOpen(false)
    setTeamAlert(null)
  }

  const handleSave = (payload: TaskFormPayload) => {
    if (!selectedTeamId) {
      setTeamAlert('Select a team before creating tasks.')
      return
    }

    const nextPayload: CreateTaskInput = { ...payload, teamId: selectedTeamId }

    if (editingTask) {
      const { teamId, ...rest } = nextPayload
      updateTask({ id: editingTask.id, data: rest }, { onSuccess: closeModal })
      return
    }

    createTask(nextPayload, { onSuccess: closeModal })
  }

  const openNewTask = () => {
    if (!selectedTeamId) {
      setTeamAlert('Pick a team before creating a task.')
      return
    }
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const { data: teamMessages = [], isLoading: messagesLoading } = useTeamMessages(selectedTeamId ?? undefined, !!selectedTeamId)
  const messageMutation = useCreateTeamMessage()
  const isSendingMessage = messageMutation.isPending
  const messageError = messageMutation.error

  useTeamChatSocket(selectedTeamId ?? undefined)

  const handleSendMessage = (content: string) => {
    if (!selectedTeamId) return
    messageMutation.mutate({ teamId: selectedTeamId, content })
  }

  const handleCreateTeam = async (payload: { name: string; description?: string }) => {
    try {
      const team = await createTeamMutation.mutateAsync(payload)
      setSelectedTeamId(team.id)
    } catch {
      // error handled in sidebar
    }
  }

  const handleJoinTeam = async (payload: { inviteCode?: string; teamId?: string }) => {
    try {
      const team = await joinTeamMutation.mutateAsync(payload)
      setSelectedTeamId(team.id)
    } catch {
      // error handled in sidebar
    }
  }

  const handleCopyInvite = async () => {
    if (!selectedTeam?.inviteCode) return
    try {
      await navigator.clipboard.writeText(selectedTeam.inviteCode)
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 1800)
    } catch {
      //
    }
  }

  const headerLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
  ]

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
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <TeamSidebar
            teams={teams}
            selectedTeamId={selectedTeamId ?? undefined}
            onSelectTeam={(id) => setSelectedTeamId(id)}
            onCreateTeam={handleCreateTeam}
            onJoinTeam={handleJoinTeam}
            isCreating={isCreatingTeam}
            isJoining={isJoiningTeam}
            createError={createTeamError}
            joinError={joinTeamError}
            isLoading={teamsLoading}
            currentUserId={profile?.id}
          />

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {selectedTeam ? 'Team workspace' : 'No team'}
                  </p>
                  <h2 className="text-3xl font-semibold text-slate-900">
                    {selectedTeam?.name ?? 'Select or create a team'}
                  </h2>
                  {selectedTeam?.description && (
                    <p className="mt-2 text-sm text-slate-500">{selectedTeam.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                    <span>Role: {currentRole}</span>
                    {selectedTeam?.inviteCode && (
                      <button onClick={handleCopyInvite} className="text-indigo-600 underline-offset-2 hover:text-indigo-500">
                        Copy invite code
                      </button>
                    )}
                    {inviteCopied && <span className="text-emerald-500">Copied!</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" onClick={openNewTask} disabled={!selectedTeam}>
                    Assign task
                  </Button>
                  <Button onClick={openNewTask} disabled={!selectedTeam}>
                    + Create Task
                  </Button>
                </div>
              </div>
              {teamAlert && <p className="mt-2 text-sm text-rose-500">{teamAlert}</p>}
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {tabLabels.map((entry) => (
                      <button
                        key={entry.label}
                        type="button"
                        onClick={() => setTab(entry.value)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          tab === entry.value
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: 'Status', setter: setStatus, value: status, options: statusOptions },
                      { label: 'Priority', setter: setPriority, value: priority, options: priorityOptions },
                      {
                        label: 'Sort by',
                        setter: setSortBy,
                        value: sortBy,
                        options: [
                          { label: 'Due date', value: 'dueDate' },
                          { label: 'Created at', value: 'createdAt' },
                        ],
                      },
                    ].map((filter) => (
                      <div key={filter.label}>
                        <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                          {filter.label}
                        </label>
                        <select
                          value={filter.value ?? ''}
                          onChange={(event) => {
                            const nextValue = event.target.value || undefined
                            filter.setter(nextValue as any)
                          }}
                          className="mt-2 w-32 rounded border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {filter.options.map((option) => (
                            <option key={option.label} value={option.value ?? ''}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <TaskList
                    tasks={tasks}
                    isLoading={tasksLoading}
                    emptyMessage={
                      selectedTeam ? 'No tasks match the current filters.' : 'Choose a team to see tasks.'
                    }
                    onTaskClick={setDetailTask}
                    currentUserId={profile?.id}
                  />
                </div>
              </section>

              <TeamChatPanel
                teamId={selectedTeamId ?? undefined}
                teamName={selectedTeam?.name}
                messages={teamMessages}
                isLoading={!teamMessages.length && messagesLoading}
                isSending={isSendingMessage}
                sendError={messageError}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-white/60 px-4 py-6 text-xs uppercase tracking-[0.2em] text-slate-500">
        <div className="flex flex-wrap justify-between gap-3">
          <span>Ac {new Date().getFullYear()} TaskFlow</span>
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

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        isSaving={isSavingTask}
        members={memberUsers}
        currentUser={profile ?? null}
        editingTask={editingTask}
        teamName={selectedTeam?.name ?? undefined}
      />

      {detailTask && (
        <TaskDetailDrawer
          task={detailTask}
          onClose={closeDetail}
          subtasks={subtasksByTask[detailTask.id] ?? []}
          onAddSubtask={(title) => {
            setSubtasksByTask((prev) => {
              const existing = prev[detailTask.id] ?? []
              return {
                ...prev,
                [detailTask.id]: [...existing, { id: `${detailTask.id}-${Date.now()}`, title, status: 'ToDo' }],
              }
            })
          }}
          onEdit={() => {
            openEditModal(detailTask)
            closeDetail()
          }}
        />
      )}
    </div>
  )
}
