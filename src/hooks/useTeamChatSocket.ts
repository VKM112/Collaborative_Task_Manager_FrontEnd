import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import type { TeamMessage } from '../features/chat/types'

export function useTeamChatSocket(teamId?: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!teamId) return

    const baseUrl =
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
    const socket = io(baseUrl, { withCredentials: true })

    socket.emit('join-team', teamId)

    socket.on('team:message', (message: TeamMessage) => {
      queryClient.setQueryData<TeamMessage[]>(['teamMessages', teamId], (old = []) => [
        ...old,
        message,
      ])
    })

    return () => {
      socket.emit('leave-team', teamId)
      socket.disconnect()
    }
  }, [teamId, queryClient])
}
