import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getTasks, updateTask } from '../../api/tasks.api'
import type { Task, TaskFilters, TaskFormValues } from './types'

export const useTasks = (filters?: TaskFilters) =>
  useQuery<Task[], Error>({
    queryKey: ['tasks', filters],
    queryFn: () => getTasks(filters),
    staleTime: 1000 * 60 * 2,
  })

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, TaskFormValues>({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, { taskId: string; payload: Partial<Task> }>({
    mutationFn: ({ taskId, payload }) => updateTask(taskId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
