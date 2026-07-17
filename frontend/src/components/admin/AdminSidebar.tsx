import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Box,
  FolderTree,
  FileText,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Tag,
  Image,
  LogOut,
  DownloadCloud,
  ShoppingCart,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Catalog',
    items: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
      { name: 'Products', path: '/admin/products', icon: Box },
      { name: 'Categories', path: '/admin/categories', icon: FolderTree },
      { name: 'Brands', path: '/admin/brands', icon: Tag },
      { name: 'Scraper', path: '/admin/scraper', icon: DownloadCloud },
    ],
  },
  {
    title: 'Sales',
    items: [
      { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Banners', path: '/admin/banners', icon: Image },
    ],
  },
  {
    title: 'Services',
    items: [
      { name: 'Solution Blueprints', path: '/admin/services', icon: FileText },
    ],
  },
  {
    title: 'Settings',
    items: [
      { name: 'AI Configuration', path: '/admin/ai-settings', icon: Cpu },
    ],
  },
]

export default function AdminSidebar({ isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-bg-surface border-r border-border transition-all duration-200 z-30 select-none',
        isCollapsed ? 'w-[64px]' : 'w-[224px]'
      )}
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2 overflow-hidden min-w-0">
          {isCollapsed ? (
            <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center shrink-0">
              <span className="font-mono font-bold text-white text-xs">ZX</span>
            </div>
          ) : (
            <Logo className="h-5" />
          )}
        </Link>

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-sm text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors shrink-0"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <h3 className="px-2 mb-1 text-[10px] font-semibold tracking-wide text-text-muted uppercase">
                {group.title}
              </h3>
            )}

            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/admin' && location.pathname.startsWith(item.path))
                const Icon = item.icon

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-accent-subtle/40 text-accent font-semibold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-2.5 border-t border-border">
        <div className={cn('flex items-center gap-2', isCollapsed ? 'flex-col' : 'justify-between px-1')}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-[10px] font-bold shrink-0">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-text-muted truncate">
                  {user?.email || ''}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-sm text-text-muted hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
