import { useEffect, useMemo, useState } from 'react'
import Button from '../components/common/Button'
import { TaskList } from '../components/tasks/TaskList'
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer'
import TaskFormModal from '../components/tasks/TaskFormModal'
import WorkspaceHeader from '../components/layout/WorkspaceHeader'
import WorkspaceFooter from '../components/layout/WorkspaceFooter'
import { useCreateTask, useTasks, useUpdateTask } from '../features/tasks/hooks'
import type { CreateTaskInput, Subtask, Task, TaskFilters, TaskFormPayload } from '../features/tasks/types'
import { useProfile } from '../features/auth/hooks'
import type { User } from '../features/auth/types'
import { useTeams, useTeamMembers } from '../features/teams/hooks'

const scopes = [
  { label: 'All tasks', value: 'all' },
  { label: 'Team tasks', value: 'team' },
  { label: 'Personal tasks', value: 'personal' },
] as const

type TaskScope = (typeof scopes)[number]['value']

export default function AllTasksPage() {
  const [scope, setScope] = useState<TaskScope>('all')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [subtasksByTask, setSubtasksByTask] = useState<Record<string, Subtask[]>>({})
  const [taskMode, setTaskMode] = useState<'team' | 'personal'>('team')
  const [taskAlert, setTaskAlert] = useState<string | null>(null)

  const { data: profile } = useProfile()
  const { data: teams = [] } = useTeams(!!profile)
  const { data: teamMembers = [] } = useTeamMembers(selectedTeamId ?? undefined, !!selectedTeamId)

  useEffect(() => {
    if (taskMode === 'personal' && profile?.id) {
      // Ensure personal tasks are assigned to the current user
      setTaskAlert(null)
    }
  }, [taskMode, profile?.id])

  useEffect(() => {
    if (!selectedTeamId && teams.length) {
      setSelectedTeamId(teams[0].id)
    }
  }, [selectedTeamId, teams])

  const memberUsers = useMemo<User[]>(() => {
    return teamMembers.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
    }))
  }, [teamMembers])

  const queryFilters = useMemo<TaskFilters>(() => {
    const filters: TaskFilters = {}
    if (scope !== 'all') {
      filters.scope = scope
    }
    if (scope === 'team' && selectedTeamId) {
      filters.teamId = selectedTeamId
    }
    return filters
  }, [scope, selectedTeamId])

  const { data: tasks = [], isLoading: tasksLoading } = useTasks(queryFilters, !!profile)

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
    setTaskAlert(null)
  }

  const handleSave = (payload: TaskFormPayload) => {
    if (taskMode === 'team') {
      const teamId = selectedTeamId || teams[0]?.id
      if (!teamId) {
        setTaskAlert('Join or create a team before creating a team task.')
        return
      }
      const nextPayload: CreateTaskInput = { ...payload, teamId }
      if (editingTask) {
        const { teamId, ...rest } = nextPayload
        updateTask({ id: editingTask.id, data: rest }, { onSuccess: closeModal })
        return
      }
      createTask(nextPayload, { onSuccess: closeModal })
      return
    }

    const personalPayload: CreateTaskInput = { ...payload, assignedToId: profile?.id }
    if (editingTask) {
      updateTask({ id: editingTask.id, data: personalPayload }, { onSuccess: closeModal })
      return
    }
    createTask(personalPayload, { onSuccess: closeModal })
  }

  const openPersonalTask = () => {
    setTaskMode('personal')
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openTeamTask = () => {
    setTaskMode('team')
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setTaskMode(task.teamId ? 'team' : 'personal')
    if (task.teamId) {
      setTaskMode('team')
      setSelectedTeamId(task.teamId)
    }
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const teamName = teams.find((team) => team.id === selectedTeamId)?.name
  const modalMembers = taskMode === 'personal' ? (profile ? [profile] : []) : memberUsers

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <WorkspaceHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:py-10 md:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tasks</p>
              <h2 className="text-3xl font-semibold text-slate-900">Your task hub</h2>
              <p className="mt-2 text-sm text-slate-500">
                Track personal tasks alongside team assignments in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={openPersonalTask}>
                + Personal Task
              </Button>
              <Button onClick={openTeamTask}>+ Team Task</Button>
            </div>
          </div>
          {taskAlert && <p className="mt-3 text-sm text-rose-500">{taskAlert}</p>}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {scopes.map((entry) => (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => setScope(entry.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    scope === entry.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {scope === 'team' && (
                <div>
                  <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Team</label>
                  <select
                    value={selectedTeamId ?? ''}
                    onChange={(event) => setSelectedTeamId(event.target.value || null)}
                    className="mt-2 w-40 rounded border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All teams</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <TaskList
              tasks={tasks}
              isLoading={tasksLoading}
              emptyMessage="No tasks match the current filters."
              onTaskClick={setDetailTask}
              currentUserId={profile?.id}
            />
          </div>
        </section>
      </main>

      <WorkspaceFooter />

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        isSaving={isSavingTask}
        members={modalMembers}
        currentUser={profile ?? null}
        editingTask={editingTask}
        teamName={taskMode === 'team' ? teamName : undefined}
        mode={taskMode}
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
