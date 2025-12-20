type LastSeenMap = Record<string, string>

const STORAGE_KEY = 'teamChatLastSeen'

const readLastSeen = (): LastSeenMap => {
  if (typeof window === 'undefined') return {}
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as LastSeenMap
  } catch {
    return {}
  }
}

export const getLastSeenMap = () => readLastSeen()

export const setTeamLastSeen = (teamId: string, timestamp: string) => {
  if (typeof window === 'undefined') return
  const map = readLastSeen()
  map[teamId] = timestamp
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  window.dispatchEvent(new Event('team-chat-last-seen'))
}
