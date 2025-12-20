import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, googleLogin, login, logout, register } from '../../api/auth.api'
import type { LoginInput, RegisterInput, User } from './types'
import { clearForcedLogout, isForcedLogout, setForcedLogout } from '../../utils/authSession.util'

export const useProfile = () =>
  useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    enabled: !isForcedLogout(),
    staleTime: 1000 * 60 * 5,
  })

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation<User, Error, LoginInput>({
    mutationFn: login,
    onSuccess: (user) => {
      clearForcedLogout()
      queryClient.setQueryData(['me'], user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation<User, Error, RegisterInput>({
    mutationFn: register,
    onSuccess: (user) => {
      clearForcedLogout()
      queryClient.setQueryData(['me'], user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      setForcedLogout()
      queryClient.removeQueries({ queryKey: ['me'] })
      queryClient.setQueryData(['me'], undefined)
    },
  })
}

export const useGoogleLogin = () => {
  const queryClient = useQueryClient()

  return useMutation<User, Error, string>({
    mutationFn: (idToken) => googleLogin(idToken),
    onSuccess: (user) => {
      clearForcedLogout()
      queryClient.setQueryData(['me'], user)
    },
  })
}
