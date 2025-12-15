import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import type { CreateTaskInput } from '../../features/tasks/types'

type TaskFormProps = {
  onSubmit: (values: CreateTaskInput) => void
  isLoading?: boolean
}

const TaskForm = ({ onSubmit, isLoading }: TaskFormProps) => {
  const { register, handleSubmit, reset } = useForm<CreateTaskInput>({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'ToDo',
      assignedToId: '',
    },
  })

  const submit = (values: CreateTaskInput) => {
    onSubmit(values)
    reset()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <Input {...register('title', { required: true })} label="Title" placeholder="Launch new sprint" />
      <Input {...register('description')} label="Description" placeholder="Describe the scope..." />
      <Input {...register('assignedToId')} label="Assignee" placeholder="User ID or email" />
      <Select
        {...register('priority')}
        label="Priority"
        options={[
          { label: 'Low', value: 'Low' },
          { label: 'Medium', value: 'Medium' },
          { label: 'High', value: 'High' },
          { label: 'Urgent', value: 'Urgent' },
        ]}
      />
      <Select
        {...register('status')}
        label="Status"
        options={[
          { label: 'To Do', value: 'ToDo' },
          { label: 'In Progress', value: 'InProgress' },
          { label: 'Review', value: 'Review' },
          { label: 'Completed', value: 'Completed' },
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
