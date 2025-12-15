import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'
import type { TaskFilters as TaskFiltersState } from '../features/tasks/types'
import { useCreateTask, useTasks } from '../features/tasks/hooks'
import { useTaskSocket } from '../hooks/useTaskSocket'

const DashboardPage = () => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<TaskFiltersState>({})
  const { data: tasks, isLoading } = useTasks(filters)
  const { mutate: createTask, isPending: isCreating } = useCreateTask()

  const invalidateTasks = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    [queryClient],
  )

  useTaskSocket(invalidateTasks)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 space-y-6 px-6 py-8">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Overview</p>
                <h1 className="text-2xl font-semibold text-slate-900">Team tasks</h1>
              </div>
              <span className="text-sm text-slate-500">Live updates in real-time</span>
            </div>
            <TaskFilters filters={filters} onChange={setFilters} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[380px,1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">New task</h2>
              <TaskForm onSubmit={createTask} isLoading={isCreating} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Task board</h2>
                <span className="text-xs uppercase tracking-wide text-slate-500">Responsive</span>
              </div>
              <TaskList tasks={tasks} isLoading={isLoading} />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
