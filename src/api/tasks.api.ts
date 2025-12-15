import type { Task, TaskFilters } from '../features/tasks/types'
import client from './client'

export const getTasks = (filters?: TaskFilters) =>
  client.get<Task[]>('/tasks', { params: filters }).then((response) => response.data)

export const createTask = (payload: Partial<Task>) =>
  client.post<Task>('/tasks', payload).then((response) => response.data)

export const updateTask = (taskId: string, payload: Partial<Task>) =>
  client.patch<Task>(`/tasks/${taskId}`, payload).then((response) => response.data)

export const deleteTask = (taskId: string) =>
  client.delete(`/tasks/${taskId}`).then((response) => response.data)
