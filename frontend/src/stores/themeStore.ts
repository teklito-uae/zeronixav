import { create } from 'zustand'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'zeronix-theme'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
  localStorage.setItem(STORAGE_KEY, theme)
}

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'dark' ? 'dark' : 'light'
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    set({ theme: next })
  },
  setTheme: (theme: Theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
