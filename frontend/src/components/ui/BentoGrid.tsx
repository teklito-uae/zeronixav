import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Video, Layers, ShieldCheck, Volume2, Server, Sparkles, Star, Clock } from 'lucide-react'
import type { Service } from '@/types/api'
import serviceSecBg from '@/assets/services/service-sec-bg.jpg'
import meetingRoomBg from '@/assets/services/meeting-room-solutions.jpg'

type Skin = 'dark' | 'light'

interface TileMeta {
  icon: ReactNode
  skin: Skin
  featured?: boolean
  stat?: { label: string; icon: ReactNode }
  bgImage?: string
}

function getTileMeta(slug: string): TileMeta {
  if (slug.includes('meeting') || slug.includes('conference')) {
    return {
      icon: <Video size={22} />,
      skin: 'dark',
      featured: true,
      stat: { label: '500+ Rooms Deployed', icon: <Star size={13} className="text-amber-400 fill-amber-400" /> },
      bgImage: meetingRoomBg,
    }
  }
  if (slug.includes('signage') || slug.includes('led')) {
    return { icon: <Layers size={22} />, skin: 'light' }
  }
  if (slug.includes('cctv') || slug.includes('surveillance') || slug.includes('security')) {
    return { icon: <ShieldCheck size={22} />, skin: 'dark', bgImage: serviceSecBg }
  }
  if (slug.includes('audio')) {
    return { icon: <Volume2 size={22} />, skin: 'light' }
  }
  return { icon: <Server size={22} />, skin: 'light' }
}

const skinClasses: Record<Skin, { tile: string; iconWrap: string; eyebrow: string; title: string; body: string; link: string }> = {
  dark: {
    tile: 'bg-gradient-to-br from-emerald-700 to-emerald-950 border border-emerald-900/40',
    iconWrap: 'bg-white/15 border border-white/25 text-white',
    eyebrow: 'text-emerald-300',
    title: 'text-white',
    body: 'text-emerald-50/80',
    link: 'text-white',
  },
  light: {
    tile: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20',
    iconWrap: 'bg-white dark:bg-white/10 border border-emerald-100 dark:border-white/10 text-accent shadow-sm',
    eyebrow: 'text-accent',
    title: 'text-emerald-950 dark:text-white',
    body: 'text-emerald-900/60 dark:text-emerald-50/60',
    link: 'text-emerald-950 dark:text-white',
  },
}

export default function BentoGrid({ services }: { services: Service[] }) {
  const featured = services.find(s => getTileMeta(s.slug).featured) || services[0]
  const rest = services.filter(s => s.id !== featured?.id).slice(0, 4)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[210px_210px_auto] gap-4 lg:gap-5">
      {/* Featured tile — Meeting Room Solutions */}
      {featured && (() => {
        const meta = getTileMeta(featured.slug)
        const c = skinClasses[meta.skin]
        return (
          <Link
            to={`/services/${featured.slug}`}
            className={`group relative overflow-hidden rounded-xl lg:col-span-2 lg:row-span-2 min-h-[300px] p-6 sm:p-8 flex flex-col justify-between ${c.tile}`}
          >
            {/* Background photo, blended into the emerald skin */}
            {meta.bgImage && (
              <>
                <img
                  src={meta.bgImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/75 to-emerald-900/40" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/50 via-transparent to-black/30" />
              </>
            )}

            {/* Decorative blobs */}
            <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-16 w-48 h-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${c.iconWrap}`}>
              {meta.icon}
            </div>

            <div className="relative z-10 space-y-2.5">
              <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider ${c.eyebrow}`}>
                Most Popular in Dubai
              </span>
              <h3 className={`text-2xl sm:text-3xl font-extrabold leading-[1.1] tracking-tight max-w-xs ${c.title}`}>
                {featured.title}
              </h3>
              <p className={`text-sm max-w-xs line-clamp-2 ${c.body}`}>
                {featured.summary}
              </p>
              <span className={`inline-flex items-center gap-1.5 pt-2 text-sm font-semibold group-hover:gap-2.5 transition-all ${c.link}`}>
                Explore solution <ArrowUpRight size={16} />
              </span>
            </div>

            {/* Floating stat chip */}
            {meta.stat && (
              <div className="hidden sm:flex absolute z-10 bottom-7 right-7 items-center gap-1.5 bg-white rounded-full pl-2 pr-3.5 py-2 shadow-lg rotate-[-3deg] group-hover:rotate-0 transition-transform">
                {meta.stat.icon}
                <span className="text-xs font-semibold text-emerald-950">{meta.stat.label}</span>
              </div>
            )}
          </Link>
        )
      })()}

      {/* Remaining service tiles */}
      {rest.map((service) => {
        const meta = getTileMeta(service.slug)
        const c = skinClasses[meta.skin]
        return (
          <Link
            key={service.id || service.slug}
            to={`/services/${service.slug}`}
            className={`group relative overflow-hidden rounded-xl min-h-[190px] p-5 flex flex-col justify-between ${c.tile}`}
          >
            {meta.bgImage && (
              <>
                <img
                  src={meta.bgImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-80 mix-blend-screen scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/30" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-black/20" />
              </>
            )}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${c.iconWrap}`}>
              {meta.icon}
            </div>
            <div className="relative z-10">
              <h3 className={`text-sm sm:text-base font-bold leading-snug mb-1 ${c.title}`}>
                {service.title}
              </h3>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-1.5 transition-all ${c.link}`}>
                View details <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>
        )
      })}

      {/* CTA tile */}
      <Link
        to="/contact"
        className="group relative overflow-hidden rounded-xl lg:col-span-4 min-h-[150px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-gradient-to-r from-emerald-800 to-emerald-950 border border-emerald-900/40"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-400/10 skew-x-[-12deg] translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-11 h-11 shrink-0 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Not sure which solution fits your space?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-50/70">
              Talk to our Dubai-based AV engineering team for a free site assessment.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-[11px] font-medium text-white">
            <Clock size={12} />
            2-Hour Response
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-emerald-950 text-sm font-semibold group-hover:bg-emerald-50 transition-colors">
            Get a Free Consultation
          </span>
        </div>
      </Link>
    </div>
  )
}
