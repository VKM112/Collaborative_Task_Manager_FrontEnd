import Badge from '../common/Badge'
import type { Task, TaskStatus } from '../../features/tasks/types'

const statusVariant: Record<TaskStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  todo: 'info',
  'in-progress': 'warning',
  done: 'success',
}

const TaskCard = ({ task }: { task: Task }) => {
  const formattedDue = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
        <Badge label={task.status} variant={statusVariant[task.status]} />
      </div>
      <p className="text-sm text-slate-600">{task.description ?? 'No description provided.'}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Assigned to: {task.assignee ?? 'Unassigned'}</span>
        <span>Priority: {task.priority}</span>
        <span>Due: {formattedDue}</span>
      </div>
    </article>
  )
}

export default TaskCard
