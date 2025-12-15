import { useState } from 'react';
import { useTasks } from '../features/tasks/hooks';
import type { Priority, Status, TaskFilters } from '../features/tasks/types';
import { TaskList } from '../components/tasks/TaskList';

const statusOptions: { label: string; value?: Status }[] = [
  { label: 'All', value: undefined },
  { label: 'To Do', value: 'ToDo' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Review', value: 'Review' },
  { label: 'Completed', value: 'Completed' },
];

const priorityOptions: { label: string; value?: Priority }[] = [
  { label: 'All', value: undefined },
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Urgent', value: 'Urgent' },
];

export default function DashboardPage() {
  const [status, setStatus] = useState<Status | undefined>();
  const [priority, setPriority] = useState<Priority | undefined>();
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt'>('dueDate');
  const [tab, setTab] = useState<'assignedToMe' | 'createdByMe' | 'all' | 'overdue'>(
    'assignedToMe',
  );

  const filters: TaskFilters = {
    status,
    priority,
    sortBy,
    assignedToMe: tab === 'assignedToMe',
    createdByMe: tab === 'createdByMe',
    overdue: tab === 'overdue',
  };

  const { data: tasks = [], isLoading } = useTasks(filters);

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-8 py-4 md:py-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage your tasks with filters and sorting.
        </p>
      </header>

      {/* Tabs: Assigned / Created / All / Overdue */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'assignedToMe', label: 'Assigned to me' },
          { key: 'createdByMe', label: 'Created by me' },
          { key: 'all', label: 'All tasks' },
          { key: 'overdue', label: 'Overdue' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-3 py-1 rounded-full text-xs md:text-sm border ${
              tab === t.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 md:gap-4 items-center mb-5 md:mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            value={status ?? ''}
            onChange={e =>
              setStatus(e.target.value ? (e.target.value as Status) : undefined)
            }
            className="border rounded px-2 py-1 text-xs md:text-sm bg-white"
          >
            {statusOptions.map(opt => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Priority</label>
          <select
            value={priority ?? ''}
            onChange={e =>
              setPriority(e.target.value ? (e.target.value as Priority) : undefined)
            }
            className="border rounded px-2 py-1 text-xs md:text-sm bg-white"
          >
            {priorityOptions.map(opt => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={e =>
              setSortBy(e.target.value as 'dueDate' | 'createdAt')
            }
            className="border rounded px-2 py-1 text-xs md:text-sm bg-white"
          >
            <option value="dueDate">Due date</option>
            <option value="createdAt">Created at</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        emptyMessage="No tasks match the current filters."
      />
    </div>
  );
}
