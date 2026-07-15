import { Link, useLocation } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/brands': 'Brands',
  '/admin/banners': 'Banners',
  '/admin/services': 'Solution Blueprints',
  '/admin/ai-settings': 'AI Configuration',
}

function getPageTitle(path: string) {
  if (PAGE_TITLES[path]) return PAGE_TITLES[path]
  const match = Object.keys(PAGE_TITLES).find((p) => p !== '/admin' && path.startsWith(p))
  return match ? PAGE_TITLES[match] : 'Admin'
}

export default function AdminHeader() {
  const location = useLocation()

  return (
    <header className="h-14 border-b border-border bg-bg-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      <h1 className="text-sm font-semibold text-text-primary truncate">
        {getPageTitle(location.pathname)}
      </h1>

      <Link
        to="/"
        target="_blank"
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <span>View site</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </header>
  )
}
