import { useState } from 'react'

export interface Hotspot {
  id: string
  label: string
  /** Position as a percentage of image width/height, e.g. 22 = 22% from the left. */
  x: number
  y: number
}

interface ProductSpotlightImageProps {
  image: string
  alt: string
  hotspots: Hotspot[]
}

export default function ProductSpotlightImage({ image, alt, hotspots }: ProductSpotlightImageProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border shadow-card bg-bg-surface">
      <img src={image} alt={alt} className="w-full h-auto block" />

      {hotspots.map((spot) => {
        const isActive = activeId === spot.id
        return (
          <button
            key={spot.id}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onMouseEnter={() => setActiveId(spot.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(spot.id)}
            onBlur={() => setActiveId(null)}
            onClick={() => setActiveId(isActive ? null : spot.id)}
            aria-label={spot.label}
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent/50 animate-ping" />
            <span className="relative inline-flex w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-accent border-2 border-white shadow-md" />

            <span
              role="tooltip"
              className={`pointer-events-none absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-semibold shadow-lg transition-all duration-150 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
              }`}
            >
              {spot.label}
              <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-zinc-950" />
            </span>
          </button>
        )
      })}
    </div>
  )
}
