import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, googleLogin, login, logout, register } from '../../api/auth.api'
import type { LoginInput, RegisterInput, User } from './types'

export const useProfile = () =>
  useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  })

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation<User, Error, LoginInput>({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation<User, Error, RegisterInput>({
    mutationFn: register,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] })
    },
  })
}

export const useGoogleLogin = () => {
  const queryClient = useQueryClient()

  return useMutation<User, Error, string>({
    mutationFn: (idToken) => googleLogin(idToken),
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user)
    },
  })
}
