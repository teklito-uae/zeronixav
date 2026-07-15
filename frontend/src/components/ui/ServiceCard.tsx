import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers, Cpu, Video, Volume2, Server, ShieldCheck } from 'lucide-react'
import type { Service } from '@/types/api'

interface ServiceCardProps {
  service: Service
}

const getServiceIcon = (slug: string) => {
  if (slug.includes('meeting') || slug.includes('conference')) return <Video size={20} className="text-accent" />
  if (slug.includes('signage') || slug.includes('led')) return <Layers size={20} className="text-accent" />
  if (slug.includes('cctv') || slug.includes('surveillance')) return <ShieldCheck size={20} className="text-accent" />
  if (slug.includes('audio')) return <Volume2 size={20} className="text-accent" />
  if (slug.includes('infrastructure') || slug.includes('server')) return <Server size={20} className="text-accent" />
  return <Cpu size={20} className="text-accent" />
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-border bg-bg-raised hover:border-accent/40 hover:shadow-card transition-all duration-200"
    >
      <div>
        <div className="w-11 h-11 rounded-full bg-accent-muted border border-accent/15 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          {getServiceIcon(service.slug)}
        </div>

        <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors mb-2">
          {service.title}
        </h3>

        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {service.summary || 'End-to-end AV engineering, system design, and proactive support across Dubai and the wider GCC.'}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors">
          View solution
        </span>
        <span className="w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  )
}
