import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Video, Users2, Lightbulb, MonitorPlay, ArrowRight } from 'lucide-react'
import type { Service } from '@/types/api'
import { teamSpacePath } from '@/lib/teamSpaceSlugs'
import conferenceRoomBg from '@/assets/solutions/b2b-solution-conference-room-thumbnail.webp'
import huddleSpaceBg from '@/assets/solutions/b2b-solution-huddle-space-thumbnail.webp'
import ideationSpaceBg from '@/assets/solutions/b2b-solution-ideation-space-thumbnail-0923.webp'
import immersiveVideoRoomsBg from '@/assets/solutions/b2b-solution-immersive-video-rooms-thumbnail.webp'

interface TileMeta {
  icon: ReactNode
  image: string
}

function getTileMeta(slug: string): TileMeta {
  if (slug.includes('conference')) {
    return { icon: <Video size={26} />, image: conferenceRoomBg }
  }
  if (slug.includes('huddle')) {
    return { icon: <Users2 size={26} />, image: huddleSpaceBg }
  }
  if (slug.includes('ideation')) {
    return { icon: <Lightbulb size={26} />, image: ideationSpaceBg }
  }
  return { icon: <MonitorPlay size={26} />, image: immersiveVideoRoomsBg }
}

export default function SpaceTypeGrid({ spaceTypes }: { spaceTypes: Service[] }) {
  if (spaceTypes.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {spaceTypes.map((space) => {
        const meta = getTileMeta(space.slug)
        return (
          <Link
            key={space.id || space.slug}
            to={teamSpacePath(space.slug)}
            className="group relative overflow-hidden rounded-xl min-h-[380px] p-6 flex flex-col justify-between border border-white/10 bg-cover bg-center transition-transform duration-700"
            style={{ backgroundImage: `url(${meta.image})` }}
          >
            {/* Gradient scrim so the light photo doesn't drown out the copy */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/20 pointer-events-none transition-opacity duration-700 group-hover:from-zinc-950/95" />

            <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white backdrop-blur-sm">
              {meta.icon}
            </div>

            <div className="relative z-10 space-y-2.5">
              <h3 className="text-xl font-extrabold text-white leading-tight tracking-tight">
                {space.title}
              </h3>
              <p className="text-xs text-emerald-50/70 leading-relaxed line-clamp-3">
                {space.summary}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-white text-emerald-950 text-[11px] font-bold uppercase tracking-wider group-hover:gap-2.5 transition-all">
                Explore
                <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
