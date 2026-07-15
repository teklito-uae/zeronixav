import { create } from 'zustand'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SolutionBuilderState {
  messages: Message[]
  isLoading: boolean
  sessionId: string
  addMessage: (role: Message['role'], content: string) => void
  setLoading: (loading: boolean) => void
  clearSession: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useSolutionBuilderStore = create<SolutionBuilderState>((set) => ({
  messages: [],
  isLoading: false,
  sessionId: generateId(),
  addMessage: (role, content) =>
    set(s => ({
      messages: [...s.messages, { id: generateId(), role, content, timestamp: new Date() }],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearSession: () => set({ messages: [], sessionId: generateId() }),
}))
