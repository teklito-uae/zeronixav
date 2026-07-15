import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rashid Al Marri',
    role: 'Facilities Director',
    company: 'Emirates Logistics Group',
    quote: 'ZeroNix redesigned every meeting room across our Al Quoz HQ in under three weeks. Zero-touch Teams Rooms, no more dropped calls, and their SLA team answers within the hour, every time.',
    rating: 5,
  },
  {
    name: 'Fatima Al Suwaidi',
    role: 'Head of IT Infrastructure',
    company: 'Gulf Horizon Bank',
    quote: 'The AI room configurator alone saved us weeks of back-and-forth with vendors. What impressed us most was the acoustic tuning — our boardrooms finally sound as good as they look.',
    rating: 5,
  },
  {
    name: 'James Whitfield',
    role: 'Regional Operations Manager',
    company: 'Meridian Real Estate',
    quote: "We rolled out digital signage across 12 properties with ZeroNix handling design, install, and content scheduling. Consistent branding, on time, and genuinely painless to manage.",
    rating: 5,
  },
  {
    name: 'Layla Haddad',
    role: 'Chief Security Officer',
    company: 'Falcon Retail Holdings',
    quote: 'Their CCTV and access control rollout was SIRA-compliant from day one — no rework, no surprises during audit. The hot-swap warranty has already saved us twice this year.',
    rating: 5,
  },
  {
    name: 'Omar Al Zaabi',
    role: 'General Manager',
    company: 'Nova Business Center',
    quote: "Five branches, one integration partner, one support number. That's exactly what we needed. ZeroNix's engineers are certified, punctual, and clearly know Crestron and Yealink inside out.",
    rating: 5,
  },
  {
    name: 'Sarah Thompson',
    role: 'Workplace Experience Lead',
    company: 'Bluewave Consulting',
    quote: "From huddle rooms to our 30-seat boardroom, every space runs the same tested hardware stack. Our own IT team can now support it without calling in a specialist.",
    rating: 5,
  },
]

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="h-full flex flex-col rounded-2xl border border-border bg-bg-raised shadow-soft p-6 sm:p-7">
      <Quote size={28} className="text-accent/25 shrink-0" fill="currentColor" strokeWidth={0} />

      <div className="flex items-center gap-0.5 mt-3">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={13} className="text-amber-400" fill="currentColor" strokeWidth={0} />
        ))}
      </div>

      <p className="mt-3 text-sm text-text-secondary leading-relaxed flex-1">
        "{t.quote}"
      </p>

      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/60">
        <div className="w-10 h-10 rounded-full bg-accent-muted text-accent flex items-center justify-center text-xs font-bold shrink-0">
          {initials(t.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{t.name}</p>
          <p className="text-xs text-text-secondary truncate">{t.role}, {t.company}</p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', loop: true, skipSnaps: false, dragFree: false },
    [Autoplay({ delay: 3200, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles size={13} />
          Client Reviews
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary mt-1.5 tracking-tight">
          Trusted by Facilities & IT Teams Across Dubai
        </h2>
        <p className="text-sm text-text-secondary mt-3">
          Real feedback from the operations, IT, and facilities leaders we've delivered AV and security systems for.
        </p>
      </div>

      <div className="relative">
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          ref={emblaRef}
        >
          <div className="flex -ml-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="min-w-0 pl-5 flex-[0_0_88%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-1.5">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to review ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-6 bg-accent'
                    : 'w-1.5 bg-border hover:bg-text-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous reviews"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next reviews"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
