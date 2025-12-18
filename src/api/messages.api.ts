import { api } from './client'
import type { TeamMessage } from '../features/chat/types'

type MessagesResponse = { messages: TeamMessage[] }
type CreateMessageResponse = { message: TeamMessage }

export async function getTeamMessages(teamId: string) {
  const res = await api.get<MessagesResponse>(`/teams/${teamId}/messages`)
  return res.data.messages
}

export async function createTeamMessage(teamId: string, content: string) {
  const res = await api.post<CreateMessageResponse>(`/teams/${teamId}/messages`, { content })
  return res.data.message
}
