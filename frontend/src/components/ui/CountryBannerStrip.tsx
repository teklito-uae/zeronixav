import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { api } from '@/lib/api'
import { useCountryStore } from '@/stores/countryStore'
import type { Banner } from '@/types/api'

export default function CountryBannerStrip() {
  const country = useCountryStore(s => s.country)

  const { data, isLoading } = useQuery<{ banners: Banner[] }>({
    queryKey: ['banners', country],
    queryFn: () => api.get<{ banners: Banner[] }>('/api/v1/banners', { country }),
    staleTime: 5 * 60 * 1000,
  })

  const banners = data?.banners ?? []

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: banners.length > 1, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect) }
  }, [emblaApi, banners.length])

  if (isLoading) {
    return (
      <section className="w-full py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-28 sm:h-36 lg:h-44 rounded-2xl bg-bg-surface animate-pulse" />
        </div>
      </section>
    )
  }

  if (banners.length === 0) return null

  return (
    <section className="relative w-full" aria-label="Regional promotions">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              {banner.link_url ? (
                <a href={banner.link_url} className="block h-28 sm:h-36 lg:h-44 w-full overflow-hidden">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <div className="h-28 sm:h-36 lg:h-44 w-full overflow-hidden">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              onClick={() => scrollTo(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
