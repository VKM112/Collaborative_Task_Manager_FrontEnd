import { useMutation, useQuery } from '@tanstack/react-query'
import { login, register, fetchProfile } from '../../api/auth.api'
import type { AuthResponse, LoginInput, RegisterInput, User } from './types'

export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: (payload) => login(payload),
  })

export const useRegister = () =>
  useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: (payload) => register(payload),
  })

export const useProfile = () =>
  useQuery<User, Error>({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
    staleTime: 1000 * 60 * 5,
  })
