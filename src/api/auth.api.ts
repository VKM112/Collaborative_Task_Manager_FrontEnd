import { api } from './client';
import type { User } from '../features/auth/types';

export async function login(data: { email: string; password: string }) {
  const res = await api.post<{ user: User }>('/auth/login', data);
  return res.data.user;
}

export async function register(data: { name: string; email: string; password: string }) {
  const res = await api.post<{ user: User }>('/auth/register', data);
  return res.data.user;
}

export async function getCurrentUser() {
  const res = await api.get<{ user: User }>('/auth/me');
  return res.data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}
