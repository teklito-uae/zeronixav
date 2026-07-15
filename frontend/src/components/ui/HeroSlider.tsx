import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import heroBg from '@/assets/hero-bg/green-flash-hero-bg.jpg'
import conferenceRoomBg from '@/assets/hero-bg/conference-room-meeting-bg.webp'
import digitalSignageBg from '@/assets/hero-bg/digital-signage-hero-banner.webp'

interface Slide {
  eyebrow: string
  title: string
  highlight: string
  description: string
  ctaLabel: string
  ctaHref: string
  secondaryLabel: string
  secondaryHref: string
  bgImage?: string
}

const SLIDES: Slide[] = [
  {
    eyebrow: 'Dubai’s AV Integration Partner',
    title: 'Seamless Meeting Room Solutions for',
    highlight: 'Modern Workspaces',
    description: 'Connect. Collaborate. Succeed. We design and install Microsoft Teams Rooms, Zoom Rooms, and Cisco Webex systems for boardrooms across Dubai and the wider GCC.',
    ctaLabel: 'Explore Meeting Rooms',
    ctaHref: '/services/meeting-room-solutions-in-dubai',
    secondaryLabel: 'Get a Free Consultation',
    secondaryHref: '/contact',
    bgImage: conferenceRoomBg,
  },
  {
    eyebrow: 'Immersive Visual Experiences',
    title: 'Digital Signage & LED Walls Built for',
    highlight: 'High-Impact Spaces',
    description: 'Fine-pitch LED video walls and cloud-managed digital signage networks for retail, hospitality, and corporate lobbies across Dubai.',
    ctaLabel: 'View LED & Signage',
    ctaHref: '/services/digital-signage-led-walls-in-dubai',
    secondaryLabel: 'Get a Free Consultation',
    secondaryHref: '/contact',
    bgImage: digitalSignageBg,
  },
  {
    eyebrow: 'Enterprise-Grade Security',
    title: 'AI-Powered CCTV & Video',
    highlight: 'Surveillance Systems',
    description: 'SIRA-compliant IP surveillance with facial recognition, license plate detection, and 24/7 monitoring for facilities across Dubai.',
    ctaLabel: 'Explore Surveillance',
    ctaHref: '/services/cctv-video-surveillance-in-dubai',
    secondaryLabel: 'Get a Free Consultation',
    secondaryHref: '/contact',
  },
  {
    eyebrow: 'Studio-Grade Sound',
    title: 'Audio & Conferencing Systems for',
    highlight: 'Every Room Size',
    description: 'DSP-tuned speaker arrays, ceiling microphones, and Dante audio-over-IP networks engineered for crystal-clear speech intelligibility.',
    ctaLabel: 'Explore Audio Systems',
    ctaHref: '/services/audio-conferencing-systems-in-dubai',
    secondaryLabel: 'Get a Free Consultation',
    secondaryHref: '/contact',
  },
]

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])

  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950" aria-label="Featured AV solutions">
      {/* Shared backdrop — stays put while slide text/CTAs change on top */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {SLIDES.map((slide, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[64vh] min-h-[420px] max-h-[620px] sm:h-[68vh] w-full">
                {slide.bgImage && (
                  <img
                    src={slide.bgImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 pointer-events-none"
                  />
                )}
                {slide.bgImage && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-950/50 to-transparent pointer-events-none" />
                )}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
                  <div className="max-w-xl space-y-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-emerald-300">
                      {slide.eyebrow}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                      {slide.title} <span className="text-emerald-400">{slide.highlight}</span>
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        to={slide.ctaHref}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-medium text-sm shadow-lg shadow-emerald-900/30 transition-all"
                      >
                        {slide.ctaLabel}
                        <ArrowRight size={16} />
                      </Link>
                      <Link
                        to={slide.secondaryHref}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-medium text-sm transition-all"
                      >
                        {slide.secondaryLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating trust chip */}
      <div className="hidden sm:flex absolute z-10 bottom-16 right-8 lg:right-16 items-center gap-2 bg-white rounded-full pl-2.5 pr-4 py-2 shadow-lg rotate-[-2deg]">
        <div className="flex -space-x-2">
          {['bg-emerald-500', 'bg-emerald-700', 'bg-emerald-300'].map((c, idx) => (
            <span key={idx} className={`w-6 h-6 rounded-full ${c} border-2 border-white`} />
          ))}
        </div>
        <span className="text-xs font-semibold text-emerald-950">Trusted by 40+ Dubai Businesses</span>
      </div>

      {/* Arrows — desktop only */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white items-center justify-center transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white items-center justify-center transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? 'w-7 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
