import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="h-9 bg-gradient-to-r from-emerald-950 via-zinc-950 to-emerald-950 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between text-[11px] font-medium">
        <div className="flex items-center gap-5">
          <a href="tel:+971567850662" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone size={12} className="text-emerald-400" />
            +971 56 785 0662
          </a>
          <a href="mailto:info@zeronix.ae" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail size={12} className="text-emerald-400" />
            info@zeronix.ae
          </a>
          <span className="hidden lg:flex items-center gap-1.5 text-zinc-400">
            <MapPin size={12} className="text-emerald-400" />
            Bur Dubai, Dubai, UAE
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden md:inline text-zinc-400">
            Serving Dubai &amp; the wider GCC
          </span>
          <Link
            to="/contact"
            className="flex items-center gap-1 font-semibold text-emerald-300 hover:text-white transition-colors"
          >
            Free Site Visit
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}
