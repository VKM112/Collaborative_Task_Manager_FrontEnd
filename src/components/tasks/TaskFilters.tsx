import Input from '../common/Input'
import Select from '../common/Select'
import type { TaskFilters as TaskFiltersType } from '../../features/tasks/types'

type TaskFiltersProps = {
  filters: TaskFiltersType
  onChange: (filters: TaskFiltersType) => void
}

const TaskFilters = ({ filters, onChange }: TaskFiltersProps) => {
  const update = (payload: Partial<TaskFiltersType>) => onChange({ ...filters, ...payload })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Input
        label="Search"
        placeholder="Search tasks"
        value={filters.search ?? ''}
        onChange={(event) => update({ search: event.target.value })}
      />
      <Select
        label="Status"
        value={filters.status ?? ''}
        onChange={(event) =>
          update({
            status: event.target.value ? (event.target.value as TaskFiltersType['status']) : undefined,
          })
        }
        options={[
          { label: 'All statuses', value: '' },
          { label: 'Todo', value: 'todo' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Done', value: 'done' },
        ]}
      />
      <Select
        label="Priority"
        value={filters.priority ?? ''}
        onChange={(event) =>
          update({
            priority: event.target.value ? (event.target.value as TaskFiltersType['priority']) : undefined,
          })
        }
        options={[
          { label: 'All priorities', value: '' },
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ]}
      />
    </div>
  )
}

export default TaskFilters
