import type { Task } from '../../features/tasks/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  currentUserId?: string;
}

const priorityStyle: Record<Task['priority'], string> = {
  Low: 'border-emerald-200 bg-emerald-50',
  Medium: 'border-amber-200 bg-amber-50',
  High: 'border-rose-200 bg-rose-50',
  Urgent: 'border-fuchsia-200 bg-fuchsia-50',
}

export function TaskCard({ task, onClick, currentUserId }: TaskCardProps) {
  const isAssignedToCurrent = task.assignedTo?.id === currentUserId
  const assigneeLabel = task.assignedTo?.name ?? 'Unassigned'
  const assignmentMessage = isAssignedToCurrent
    ? 'You are responsible for this task.'
    : task.assignedTo
    ? `Assigned to ${assigneeLabel}`
    : 'No assignee yet'

  return (
    <div
      className={`border rounded-2xl p-4 shadow-sm transition hover:shadow-md cursor-pointer ${priorityStyle[task.priority]}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-slate-900">{task.title}</h3>
          <p className="text-xs text-slate-500">{task.creator.name}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex-1">{assignmentMessage}</span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1">
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">due</span>
            <span className="text-[0.75rem] font-semibold text-slate-900">
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
