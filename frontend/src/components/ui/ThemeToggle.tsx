import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-bg-surface text-text-secondary hover:text-accent hover:border-accent/40 transition-colors ${className}`}
    >
      <Sun size={17} className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
      <Moon size={17} className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
    </button>
  )
}
