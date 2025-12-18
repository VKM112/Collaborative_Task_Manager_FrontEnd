import { FormEvent, useMemo, useState } from 'react'
import Button from '../common/Button'
import type { TeamMessage } from '../../features/chat/types'
import { getErrorMessage } from '../../utils/api.util'

interface TeamChatPanelProps {
  teamId?: string
  teamName?: string
  messages: TeamMessage[]
  isLoading?: boolean
  isSending?: boolean
  sendError?: unknown
  onSendMessage: (content: string) => void
}

const formatTime = (value: string) => {
  const date = new Date(value)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const TeamChatPanel = ({
  teamId,
  teamName,
  messages,
  isLoading,
  isSending,
  sendError,
  onSendMessage,
}: TeamChatPanelProps) => {
  const [message, setMessage] = useState('')

  const canSend = !!teamId && message.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend) return
    onSendMessage(message.trim())
    setMessage('')
  }

  const renderedMessages = useMemo(() => {
    if (!messages || !messages.length) {
      return (
        <p className="text-sm text-slate-500">
          {teamName ? 'No messages yet. Start the conversation.' : 'Select a team to view the chat.'}
        </p>
      )
    }

    return messages.map((chat) => (
      <div key={chat.id} className="flex gap-3">
        <div className="rounded-full bg-indigo-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
          {chat.sender.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
            <span>{chat.sender.name}</span>
            <span>{formatTime(chat.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-800">{chat.content}</p>
        </div>
      </div>
    ))
  }, [messages, teamName])

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Team chat</p>
        <h2 className="text-2xl font-semibold text-slate-900">{teamName ?? 'Select a team'}</h2>
        <p className="mt-1 text-sm text-slate-500">Everything shared here is scoped to this team.</p>
      </div>

      <div className="min-h-[220px] space-y-4 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        {isLoading ? <p className="text-sm text-slate-500">Loading messages…</p> : renderedMessages}
      </div>

      <form className="space-y-2" onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={teamId ? 'Share an update with the team…' : 'Select a team to start chatting.'}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
          disabled={!teamId || isSending}
        />
        {sendError && <p className="text-xs text-rose-500">{getErrorMessage(sendError)}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={!canSend || isSending} className="text-xs font-semibold uppercase tracking-[0.3em]">
            {isSending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default TeamChatPanel
