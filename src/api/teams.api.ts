import { api } from './client'
import type { Team } from '../features/teams/types'
import type { TeamMember } from '../features/teams/types'

type PaginatedTeams = { teams: Team[] }
type MembersResponse = { members: TeamMember[] }

export async function getTeams() {
  const res = await api.get<PaginatedTeams>('/teams')
  return res.data.teams
}

export async function createTeam(payload: { name: string; description?: string }) {
  const res = await api.post<{ team: Team }>('/teams', payload)
  return res.data.team
}

export async function joinTeam(payload: { inviteCode?: string; teamId?: string }) {
  const res = await api.post<{ team: Team }>('/teams/join', payload)
  return res.data.team
}

export async function getTeamMembers(teamId: string) {
  const res = await api.get<MembersResponse>(`/teams/${teamId}/members`)
  return res.data.members
}

export async function leaveTeam(teamId: string) {
  await api.post(`/teams/${teamId}/leave`)
}

export async function deleteTeam(teamId: string) {
  await api.delete(`/teams/${teamId}`)
}
