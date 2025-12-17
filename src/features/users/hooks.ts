import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../api/users.api'

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled,
  })
}
