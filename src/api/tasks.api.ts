import { api } from './client';
import type { Task, TaskFilters, CreateTaskInput, UpdateTaskInput } from '../features/tasks/types';

export async function getTasks(params?: TaskFilters) {
  const res = await api.get<Task[]>('/tasks', { params });
  return res.data;
}

export async function createTask(data: CreateTaskInput) {
  const res = await api.post<Task>('/tasks', data);
  return res.data;
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  const res = await api.put<Task>(`/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
