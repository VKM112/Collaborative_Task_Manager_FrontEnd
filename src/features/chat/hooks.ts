import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTeamMessage, getTeamMessages } from '../../api/messages.api'
import type { TeamMessage } from './types'

export function useTeamMessages(teamId?: string, enabled = true) {
  return useQuery<TeamMessage[], Error>({
    queryKey: ['teamMessages', teamId],
    queryFn: () => {
      if (!teamId) return Promise.resolve([])
      return getTeamMessages(teamId)
    },
    enabled: enabled && !!teamId,
  })
}

export function useCreateTeamMessage() {
  return useMutation({
    mutationFn: ({ teamId, content }: { teamId: string; content: string }) =>
      createTeamMessage(teamId, content),
  })
}
