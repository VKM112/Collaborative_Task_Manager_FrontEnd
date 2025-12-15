export interface User {
  id: string
  name: string
  email: string
  role?: 'member' | 'admin'
  createdAt?: string
  avatar?: string
  provider?: 'local' | 'google'
  googleId?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}
