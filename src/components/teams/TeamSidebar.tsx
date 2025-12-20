import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../common/Button'
import type { Team } from '../../features/teams/types'
import { getErrorMessage } from '../../utils/api.util'
import { getColorStyles } from '../../utils/color.util'

interface TeamSidebarProps {
  teams: Team[]
  selectedTeamId?: string
  onSelectTeam: (teamId: string) => void
  onCreateTeam: (payload: { name: string; description?: string }) => void | Promise<void>
  onJoinTeam: (payload: { inviteCode?: string; teamId?: string }) => void | Promise<void>
  isCreating?: boolean
  isJoining?: boolean
  createError?: unknown
  joinError?: unknown
  isLoading?: boolean
  currentUserId?: string
  showCreateTeam?: boolean
  showJoinTeam?: boolean
  unreadByTeamId?: Record<string, boolean>
}

const TeamSidebar = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  onCreateTeam,
  onJoinTeam,
  isCreating,
  isJoining,
  createError,
  joinError,
  isLoading,
  currentUserId,
  showCreateTeam = true,
  showJoinTeam = true,
  unreadByTeamId,
}: TeamSidebarProps) => {
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [localCreateError, setLocalCreateError] = useState<string | null>(null)
  const [localJoinError, setLocalJoinError] = useState<string | null>(null)

  const createMessage = createError ? getErrorMessage(createError) : undefined
  const joinMessage = joinError ? getErrorMessage(joinError) : undefined

  const teamList = useMemo(() => {
    return teams.map((team) => {
      const memberCount = team.members.length
      const currentMember = team.members.find((member) => member.userId === currentUserId)
      const color = getColorStyles(team.id)
      const hasUnread = !!unreadByTeamId?.[team.id]
      return (
        <button
          key={team.id}
          type="button"
          onClick={() => onSelectTeam(team.id)}
          className={`w-full rounded-2xl border px-4 py-3 text-left ${
            selectedTeamId === team.id
              ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
              <span className="text-sm font-semibold">{team.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
              {hasUnread && <span className="h-2 w-2 rounded-full bg-rose-500" />}
              <span>{selectedTeamId === team.id ? 'Active' : 'Open'}</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {memberCount} member{memberCount === 1 ? '' : 's'}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
            Role: {currentMember?.role ?? 'MEMBER'}
          </p>
        </button>
      )
    })
  }, [teams, selectedTeamId, onSelectTeam, currentUserId, unreadByTeamId])

  const handleCreateTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!teamName.trim()) {
      setLocalCreateError('Team name is required.')
      return
    }
    setLocalCreateError(null)
    await onCreateTeam({
      name: teamName.trim(),
      description: teamDescription.trim() || undefined,
    })
    setTeamName('')
    setTeamDescription('')
  }

  const handleJoinTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!inviteCode.trim()) {
      setLocalJoinError('Invite code is required.')
      return
    }
    setLocalJoinError(null)
    await onJoinTeam({ inviteCode: inviteCode.trim() })
    setInviteCode('')
  }

  return (
    <section className="flex w-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Teams</p>
        <h2 className="text-2xl font-semibold text-slate-900">Workspaces</h2>
        <p className="mt-1 text-sm text-slate-500">Switch between the teams you collaborate with.</p>
      </div>

      {isLoading && !teams.length && (
        <p className="text-sm text-slate-500">Loading teams...</p>
      )}

      {!teams.length && !isLoading && (
        <p className="text-sm text-slate-500">You are not a member of any team yet.</p>
      )}

      <div className="flex flex-col gap-3">{teamList}</div>

      {showCreateTeam && (
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Create a team</h3>
          <form className="space-y-3" onSubmit={handleCreateTeam}>
            <input
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Team name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isCreating}
            />
            <textarea
              value={teamDescription}
              onChange={(event) => setTeamDescription(event.target.value)}
              placeholder="Optional description"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={2}
              disabled={isCreating}
            />
            {(localCreateError || createMessage) && (
              <p className="text-xs text-rose-500">{localCreateError || createMessage}</p>
            )}
            <Button
              type="submit"
              className="w-full text-xs font-semibold uppercase tracking-[0.3em]"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'New team'}
            </Button>
          </form>
        </div>
      )}

      {showJoinTeam && (
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Join with a code</h3>
          <form className="space-y-3" onSubmit={handleJoinTeam}>
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              placeholder="Unique invite code or link"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isJoining}
            />
            {(localJoinError || joinMessage) && (
              <p className="text-xs text-rose-500">{localJoinError || joinMessage}</p>
            )}
            <Button
              type="submit"
              className="w-full text-xs font-semibold uppercase tracking-[0.3em]"
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join team'}
            </Button>
          </form>
        </div>
      )}
    </section>
  )
}

export default TeamSidebar
