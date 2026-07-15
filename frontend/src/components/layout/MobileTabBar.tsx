import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Sparkles, MessageCircle } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

const TABS = [
  { label: 'Home',     to: '/',                icon: Home, end: true },
  { label: 'Solutions', to: '/#solutions',      icon: LayoutGrid, end: false },
  { label: 'AI Builder', to: '/solution-builder', icon: Sparkles, end: false },
  { label: 'Contact',  to: '/contact',          icon: MessageCircle, end: false },
]

export default function MobileTabBar() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-bg-primary/95 backdrop-blur-md border-t border-border"
      aria-label="Primary mobile navigation"
    >
      <div className="grid grid-cols-5 items-center h-16">
        {TABS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 h-full text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <div className="flex flex-col items-center justify-center gap-1 h-full">
          <ThemeToggle className="!w-8 !h-8 !border-0 !bg-transparent" />
        </div>
      </div>
    </nav>
  )
}
