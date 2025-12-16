import type { Task } from '../../features/tasks/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  emptyMessage?: string;
  onTaskClick?: (task: Task) => void;
  currentUserId?: string;
}

export function TaskList({
  tasks,
  isLoading,
  emptyMessage,
  onTaskClick,
  currentUserId,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 md:h-24 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        {emptyMessage || 'No tasks to display.'}
      </p>
    );
  }

  return (
    <div className="grid gap-3 md:gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          currentUserId={currentUserId}
          onClick={onTaskClick ? () => onTaskClick(task) : undefined}
        />
      ))}
    </div>
  );
}
