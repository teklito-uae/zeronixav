import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Logo from '@/components/ui/Logo'
import CountrySelector from '@/components/layout/CountrySelector'

const SERVICE_LINKS = [
  { label: 'Meeting Room Solutions',       href: '/services/meeting-room-solutions-in-dubai' },
  { label: 'Digital Signage & LED Walls',  href: '/services/digital-signage-led-walls-in-dubai' },
  { label: 'CCTV & Video Surveillance',    href: '/services/cctv-video-surveillance-in-dubai' },
  { label: 'Audio & Conferencing Systems', href: '/services/audio-conferencing-systems-in-dubai' },
  { label: 'IT Infrastructure Solutions',  href: '/services/it-infrastructure-solutions-in-dubai' },
]

export default function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-bg-primary/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center shrink-0">
          <Logo className="h-6 sm:h-7" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
              Services
              <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 pt-2 w-72">
                <div className="rounded-2xl border border-border bg-bg-raised shadow-card p-2">
                  {SERVICE_LINKS.map(s => (
                    <Link
                      key={s.href}
                      to={s.href}
                      className="block px-3.5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-accent hover:bg-accent-muted transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/products"
            className={({ isActive }) => `px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${isActive ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'}`}
          >
            Shop All Products
          </NavLink>
          <NavLink
            to="/solution-builder"
            className={({ isActive }) => `px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${isActive ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'}`}
          >
            AI Room Configurator
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${isActive ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'}`}
          >
            Contact
          </NavLink>
        </div>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <CountrySelector />
          <ThemeToggle className="hidden sm:inline-flex" />
          <a
            href="tel:+97148009376"
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-bg-surface text-text-secondary"
            aria-label="Call ZeroNix AV"
          >
            <Phone size={16} />
          </a>
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-accent hover:bg-accent-hover text-white transition-colors shadow-sm"
          >
            Get a Quote
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-bg-surface text-text-secondary"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4 border-t border-border bg-bg-primary">
          <div className="pt-2">
            <span className="block px-1 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Services</span>
            {SERVICE_LINKS.map(s => (
              <Link
                key={s.href}
                to={s.href}
                onClick={closeMobileMenu}
                className="block py-2.5 px-1 text-sm text-text-secondary border-b border-border last:border-0"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <Link
            to="/products"
            onClick={closeMobileMenu}
            className="block py-3 px-1 text-sm font-medium text-text-primary border-b border-border"
          >
            Shop All Products
          </Link>
          <Link
            to="/solution-builder"
            onClick={closeMobileMenu}
            className="block py-3 px-1 text-sm font-medium text-text-primary border-b border-border"
          >
            AI Room Configurator
          </Link>

          <div className="flex items-center justify-between py-3 px-1 border-b border-border">
            <span className="text-sm font-medium text-text-primary">Region</span>
            <CountrySelector />
          </div>

          <Link
            to="/contact"
            onClick={closeMobileMenu}
            className="mt-4 w-full flex items-center justify-center py-3 text-sm font-semibold rounded-full bg-accent text-white"
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  )
}
