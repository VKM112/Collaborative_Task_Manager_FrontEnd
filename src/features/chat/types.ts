export interface TeamMessageSender {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface TeamMessage {
  id: string
  content: string
  teamId: string
  senderId: string
  createdAt: string
  sender: TeamMessageSender
}
