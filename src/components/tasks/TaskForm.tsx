import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import type { TaskFormValues } from '../../features/tasks/types'

type TaskFormProps = {
  onSubmit: (values: TaskFormValues) => void
  isLoading?: boolean
}

const TaskForm = ({ onSubmit, isLoading }: TaskFormProps) => {
  const { register, handleSubmit, reset } = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    },
  })

  const submit = (values: TaskFormValues) => {
    onSubmit(values)
    reset()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <Input {...register('title', { required: true })} label="Title" placeholder="Launch new sprint" />
      <Input {...register('description')} label="Description" placeholder="Describe the scope..." />
      <Input {...register('assignee')} label="Assignee" placeholder="Name or email" />
      <Select
        {...register('priority')}
        label="Priority"
        options={[
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ]}
      />
      <Select
        {...register('status')}
        label="Status"
        options={[
          { label: 'Todo', value: 'todo' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Done', value: 'done' },
        ]}
      />
      <Input {...register('dueDate')} label="Due Date" type="date" />
      <Button type="submit" disabled={isLoading}>
        Create task
      </Button>
    </form>
  )
}

export default TaskForm
