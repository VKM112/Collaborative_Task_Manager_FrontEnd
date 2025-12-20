import { useEffect, useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getTeamMessages } from '../api/messages.api'
import { useTeams } from '../features/teams/hooks'
import { getLastSeenMap } from '../utils/teamChat.util'

export const useTeamMessageNotifications = () => {
  const { data: teams = [] } = useTeams(true)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handler = () => setVersion((prev) => prev + 1)
    window.addEventListener('team-chat-last-seen', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('team-chat-last-seen', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const queries = useQueries({
    queries: teams.map((team) => ({
      queryKey: ['teamMessages', team.id],
      queryFn: () => getTeamMessages(team.id),
      enabled: !!team.id,
      refetchInterval: 15000,
    })),
  })

  const unreadByTeamId = useMemo(() => {
    const lastSeenMap = getLastSeenMap()
    return teams.reduce<Record<string, boolean>>((acc, team, index) => {
      const messages = queries[index]?.data ?? []
      const latest = messages[messages.length - 1]?.createdAt
      const lastSeen = lastSeenMap[team.id]
      const hasUnread = !!latest && (!lastSeen || new Date(latest).getTime() > new Date(lastSeen).getTime())
      acc[team.id] = hasUnread
      return acc
    }, {})
  }, [queries, teams, version])

  const hasUnread = useMemo(() => Object.values(unreadByTeamId).some(Boolean), [unreadByTeamId])

  return { unreadByTeamId, hasUnread }
}
