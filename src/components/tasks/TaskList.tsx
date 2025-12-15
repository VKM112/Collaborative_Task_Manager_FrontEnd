import TaskCard from './TaskCard'
import Skeleton from '../common/Skeleton'
import type { Task } from '../../features/tasks/types'

type TaskListProps = {
  tasks?: Task[]
  isLoading?: boolean
}

const TaskList = ({ tasks, isLoading }: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return <p className="text-sm text-slate-500">No tasks match your current filters.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

export default TaskList
