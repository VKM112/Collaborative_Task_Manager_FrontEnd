import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, getTasks, updateTask } from '../../api/tasks.api';
import type { Task, TaskFilters, CreateTaskInput, UpdateTaskInput } from './types';

export function useTasks(filters?: TaskFilters) {
  return useQuery<Task[]>({
    queryKey: ['tasks', filters],
    queryFn: () => getTasks(filters),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
