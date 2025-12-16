import { api } from './client'
import type { User } from '../features/auth/types'

export async function getUsers() {
  const res = await api.get<User[]>('/users')
  return res.data
}
