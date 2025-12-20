import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import TeamSidebar from '../components/teams/TeamSidebar'
import TeamChatPanel from '../components/teams/TeamChatPanel'
import WorkspaceHeader from '../components/layout/WorkspaceHeader'
import WorkspaceFooter from '../components/layout/WorkspaceFooter'
import { useProfile } from '../features/auth/hooks'
import { useCreateTeam, useDeleteTeam, useJoinTeam, useLeaveTeam, useTeams, useTeamMembers } from '../features/teams/hooks'
import { useCreateTeamMessage, useTeamMessages } from '../features/chat/hooks'
import { useTeamChatSocket } from '../hooks/useTeamChatSocket'
import { useTeamMessageNotifications } from '../hooks/useTeamMessageNotifications'
import { setTeamLastSeen } from '../utils/teamChat.util'
import { getColorStyles } from '../utils/color.util'
import { getErrorMessage } from '../utils/api.util'

export default function TeamsPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const { data: profile } = useProfile()
  const [searchParams, setSearchParams] = useSearchParams()
  const { unreadByTeamId } = useTeamMessageNotifications()
  const { data: teams = [], isLoading: teamsLoading } = useTeams(!!profile)
  const createTeamMutation = useCreateTeam()
  const deleteTeamMutation = useDeleteTeam()
  const joinTeamMutation = useJoinTeam()
  const leaveTeamMutation = useLeaveTeam()
  const isCreatingTeam = createTeamMutation.isPending
  const isDeletingTeam = deleteTeamMutation.isPending
  const isJoiningTeam = joinTeamMutation.isPending
  const isLeavingTeam = leaveTeamMutation.isPending
  const createTeamError = createTeamMutation.error
  const joinTeamError = joinTeamMutation.error

  useEffect(() => {
    if (!selectedTeamId && teams.length) {
      setSelectedTeamId(teams[0].id)
      return
    }
    if (selectedTeamId && !teams.find((team) => team.id === selectedTeamId)) {
      setSelectedTeamId(teams[0]?.id ?? null)
    }
  }, [teams, selectedTeamId])

  const selectedTeam = useMemo(() => {
    return teams.find((team) => team.id === selectedTeamId) ?? null
  }, [teams, selectedTeamId])

  const teamMembers = useTeamMembers(selectedTeamId ?? undefined, !!selectedTeamId)
  const membership = (teamMembers.data ?? []).find((member) => member.userId === profile?.id)
  const currentRole = membership?.role ?? 'MEMBER'

  const { data: teamMessages = [], isLoading: messagesLoading } = useTeamMessages(selectedTeamId ?? undefined, !!selectedTeamId)
  const messageMutation = useCreateTeamMessage()
  const isSendingMessage = messageMutation.isPending
  const messageError = messageMutation.error

  useTeamChatSocket(selectedTeamId ?? undefined)

  useEffect(() => {
    if (!selectedTeamId || !teamMessages.length) return
    const latest = teamMessages[teamMessages.length - 1]?.createdAt
    if (latest) setTeamLastSeen(selectedTeamId, latest)
  }, [selectedTeamId, teamMessages])

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setIsCreateOpen(true)
      searchParams.delete('create')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleSendMessage = (content: string) => {
    if (!selectedTeamId) return
    messageMutation.mutate({ teamId: selectedTeamId, content })
  }

  const handleCreateTeam = async (payload: { name: string; description?: string }) => {
    try {
      const team = await createTeamMutation.mutateAsync(payload)
      setSelectedTeamId(team.id)
    } catch {
      // error handled in sidebar
    }
  }

  const handleJoinTeam = async (payload: { inviteCode?: string; teamId?: string }) => {
    try {
      const team = await joinTeamMutation.mutateAsync(payload)
      setSelectedTeamId(team.id)
    } catch {
      // error handled in sidebar
    }
  }

  const handleCreateTeamSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!teamName.trim()) {
      setCreateError('Team name is required.')
      return
    }
    setCreateError(null)
    await handleCreateTeam({ name: teamName.trim(), description: teamDescription.trim() || undefined })
    setTeamName('')
    setTeamDescription('')
    setIsCreateOpen(false)
  }

  const handleExitTeam = async () => {
    if (!selectedTeamId) return
    await leaveTeamMutation.mutateAsync(selectedTeamId)
    setSelectedTeamId(null)
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeamId) return
    if (!window.confirm('Delete this team? This cannot be undone.')) return
    await deleteTeamMutation.mutateAsync(selectedTeamId)
    setSelectedTeamId(null)
  }

  const handleCopyInvite = async () => {
    if (!selectedTeam?.inviteCode) return
    try {
      await navigator.clipboard.writeText(selectedTeam.inviteCode)
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 1800)
    } catch {
      //
    }
  }

  const isOwner = selectedTeam?.createdById === profile?.id
  const selectedTeamColor = getColorStyles(selectedTeam?.id)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <WorkspaceHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:py-10 md:px-6">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Teams</p>
            <h1 className="text-3xl font-semibold text-slate-900">Workspaces</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
          >
            + Create team
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <TeamSidebar
            teams={teams}
            selectedTeamId={selectedTeamId ?? undefined}
            onSelectTeam={(id) => setSelectedTeamId(id)}
            onCreateTeam={handleCreateTeam}
            onJoinTeam={handleJoinTeam}
            isCreating={isCreatingTeam}
            isJoining={isJoiningTeam}
            createError={createTeamError}
            joinError={joinTeamError}
            isLoading={teamsLoading}
            currentUserId={profile?.id}
            unreadByTeamId={unreadByTeamId}
            showCreateTeam={false}
          />

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {selectedTeam ? 'Team workspace' : 'No team'}
                  </p>
                  <div className="flex items-center gap-3">
                    {selectedTeam && <span className={`h-3 w-3 rounded-full ${selectedTeamColor.dot}`} />}
                    <h2 className="text-3xl font-semibold text-slate-900">
                      {selectedTeam?.name ?? 'Select or create a team'}
                    </h2>
                  </div>
                  {selectedTeam?.description && (
                    <p className="mt-2 text-sm text-slate-500">{selectedTeam.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                    <span>Role: {currentRole}</span>
                    {selectedTeam?.inviteCode && (
                      <button onClick={handleCopyInvite} className="text-indigo-600 underline-offset-2 hover:text-indigo-500">
                        Copy invite code
                      </button>
                    )}
                    {inviteCopied && <span className="text-emerald-500">Copied!</span>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-slate-500">
                    {selectedTeam ? 'Stay synced with your teammates in real time.' : 'Pick a team to start chatting.'}
                  </span>
                  {selectedTeam && (
                    <button
                      type="button"
                      onClick={isOwner ? handleDeleteTeam : handleExitTeam}
                      disabled={isDeletingTeam || isLeavingTeam}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                        isOwner
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {isOwner ? (isDeletingTeam ? 'Deleting...' : 'Delete team') : isLeavingTeam ? 'Exiting...' : 'Exit team'}
                    </button>
                  )}
                </div>
              </div>
            </section>

            <TeamChatPanel
              teamId={selectedTeamId ?? undefined}
              teamName={selectedTeam?.name}
              messages={teamMessages}
              isLoading={!teamMessages.length && messagesLoading}
              isSending={isSendingMessage}
              sendError={messageError}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>

      <WorkspaceFooter />
      {isCreateOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Create a team</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleCreateTeamSubmit}>
              <input
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="Team name"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                disabled={isCreatingTeam}
              />
              <textarea
                value={teamDescription}
                onChange={(event) => setTeamDescription(event.target.value)}
                placeholder="Optional description"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                rows={3}
                disabled={isCreatingTeam}
              />
              {(createError || createTeamError) && (
                <p className="text-xs text-rose-500">{createError || getErrorMessage(createTeamError)}</p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  disabled={isCreatingTeam}
                >
                  {isCreatingTeam ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
