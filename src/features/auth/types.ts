export interface User {
  id: string
  name: string
  email: string
  role?: 'member' | 'admin'
  createdAt?: string
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
