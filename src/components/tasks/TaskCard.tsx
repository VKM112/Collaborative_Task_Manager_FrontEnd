import type { Task } from '../../features/tasks/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm md:text-base line-clamp-1">
          {task.title}
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-500">
        <span>Status: {task.status}</span>
        {task.dueDate && (
          <span>
            Due:{' '}
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  );
}
