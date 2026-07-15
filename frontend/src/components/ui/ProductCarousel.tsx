import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Product } from '@/types/api'

interface ProductCarouselProps {
  products: Product[]
  title?: string
  /** Caps visible cards at 3 (vs. 5) for narrower containers, e.g. an inline article column. */
  dense?: boolean
}

export default function ProductCarousel({ products, title, dense = false }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: false,
  })

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap())
    setPrevBtnDisabled(!api.canScrollPrev())
    setNextBtnDisabled(!api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="relative w-full py-2">
      {/* Optional Header controls if title provided */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              aria-label="Previous items"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              aria-label="Next items"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Carousel Viewport — 1 visible on mobile (with next-card peek), scaling up to 5 on xl+ */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0" ref={emblaRef}>
        <div className="flex backface-hidden -ml-4 sm:-ml-5">
          {products.map((product) => (
            <div
              key={product.id || product.sku}
              className={`min-w-0 pl-4 sm:pl-5 flex-[0_0_78%] sm:flex-[0_0_50%] ${dense ? 'lg:flex-[0_0_33.333%]' : 'md:flex-[0_0_33.333%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]'}`}
            >
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Dots if no header title */}
      {!title && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
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
              disabled={prevBtnDisabled}
              aria-label="Previous items"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              aria-label="Next items"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
