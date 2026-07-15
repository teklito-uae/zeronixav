import { create } from 'zustand'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
}

interface AuthState {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  login: (token: string, user: AdminUser) => void
  logout: () => void
}

const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('zeronix_admin_token')
  }
  return null
}

const getStoredUser = (): AdminUser | null => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('zeronix_admin_user')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    }
  }
  return null
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: Boolean(getStoredToken()),
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zeronix_admin_token', token)
      localStorage.setItem('zeronix_admin_user', JSON.stringify(user))
    }
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zeronix_admin_token')
      localStorage.removeItem('zeronix_admin_user')
    }
    set({ token: null, user: null, isAuthenticated: false })
  }
}))
