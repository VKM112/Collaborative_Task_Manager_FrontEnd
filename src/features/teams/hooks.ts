import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTeam, deleteTeam, getTeamMembers, getTeams, joinTeam, leaveTeam } from '../../api/teams.api'
import type { Team, TeamMember } from './types'

export function useTeams(enabled = true) {
  return useQuery<Team[], Error>({
    queryKey: ['teams'],
    queryFn: getTeams,
    enabled,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useJoinTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { teamId?: string; inviteCode?: string }) => joinTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useTeamMembers(teamId?: string, enabled = true) {
  return useQuery<TeamMember[], Error>({
    queryKey: ['teamMembers', teamId],
    queryFn: () => {
      if (!teamId) return Promise.resolve([] as TeamMember[])
      return getTeamMembers(teamId)
    },
    enabled: enabled && !!teamId,
  })
}

export function useLeaveTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (teamId: string) => leaveTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
