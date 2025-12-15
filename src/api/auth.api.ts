import client from './client'
import type { AuthResponse, LoginInput, RegisterInput, User } from '../features/auth/types'

export const login = (payload: LoginInput) =>
  client.post<AuthResponse>('/auth/login', payload).then((response) => response.data)

export const register = (payload: RegisterInput) =>
  client.post<AuthResponse>('/auth/register', payload).then((response) => response.data)

export const fetchProfile = () =>
  client.get<User>('/auth/profile').then((response) => response.data)
