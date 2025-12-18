export type MembershipRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface TeamMember {
  teamId: string
  userId: string
  role: MembershipRole
  joinedAt: string
  user: {
    id: string
    name: string
    email?: string
    avatar?: string
  }
}

export interface Team {
  id: string
  name: string
  description?: string
  inviteCode: string
  createdById: string
  createdBy: {
    id: string
    name: string
    email?: string
  }
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}
