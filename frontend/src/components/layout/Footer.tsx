import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const services = [
  { label: 'Meeting Room Solutions',       href: '/services/meeting-room-solutions-in-dubai' },
  { label: 'Digital Signage & LED Walls',  href: '/services/digital-signage-led-walls-in-dubai' },
  { label: 'CCTV & Video Surveillance',    href: '/services/cctv-video-surveillance-in-dubai' },
  { label: 'Audio & Conferencing Systems', href: '/services/audio-conferencing-systems-in-dubai' },
  { label: 'IT Infrastructure Solutions',  href: '/services/it-infrastructure-solutions-in-dubai' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="inline-flex items-center mb-4">
            <Logo className="h-6" />
          </Link>
          <p className="text-xs leading-relaxed mb-5 text-text-secondary">
            Dubai's trusted AV integration partner. Meeting rooms, digital signage, surveillance, and IT infrastructure — designed, installed, and supported.
          </p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <MapPin size={13} className="mt-0.5 shrink-0 text-accent" />
              Office 19, Khurram Building, Al Fahidi, Bur Dubai, Dubai, UAE
            </div>
            <a href="tel:+971567850662" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors">
              <Phone size={13} className="text-accent" />
              +971 56 785 0662
            </a>
            <a href="mailto:info@zeronix.ae" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors">
              <Mail size={13} className="text-accent" />
              info@zeronix.ae
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-text-muted">Services in Dubai</h4>
          <ul className="space-y-2.5">
            {services.map(s => (
              <li key={s.href}>
                <Link to={s.href} className="text-xs text-text-secondary hover:text-accent transition-colors flex items-center gap-1 group">
                  {s.label}
                  <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-text-muted">Company</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'AI Room Configurator', href: '/solution-builder' },
              { label: 'Contact Us', href: '/contact' },
            ].map(l => (
              <li key={l.href}>
                <Link to={l.href} className="text-xs text-text-secondary hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* GCC Coverage */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-text-muted">Coverage</h4>
          <ul className="space-y-2.5">
            {['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Doha'].map(c => (
              <li key={c} className="text-xs flex items-center gap-2 text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Zeronix Technology LLC. All rights reserved.
        </p>
        <p className="text-xs text-text-muted">
          Zeronix AV is part of Zeronix Technology LLC — Registered in Dubai, UAE
        </p>
      </div>
    </footer>
  )
}
