import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Award, Cpu, Headset, CheckCircle2, Sparkles } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import HeroSlider from '@/components/ui/HeroSlider'
import BentoGrid from '@/components/ui/BentoGrid'
import SolutionsGridSkeleton from '@/components/ui/SolutionsGridSkeleton'
import ProductCarousel from '@/components/ui/ProductCarousel'
import ProductCarouselSkeleton from '@/components/ui/ProductCarouselSkeleton'
import CountryBannerStrip from '@/components/ui/CountryBannerStrip'
import { api } from '@/lib/api'
import type { HomepageData } from '@/types/api'

const BRANDS = ['Yealink', 'Logitech', 'Shure', 'Crestron', 'Hikvision', 'Samsung', 'LG', 'Jabra', 'Extron']

export default function HomePage() {
  const { data, isLoading, isError } = useQuery<HomepageData>({
    queryKey: ['homepage-data'],
    queryFn: () => api.get<HomepageData>('/api/v1/homepage-data'),
    retry: 1,
    staleTime: 5 * 60 * 1000
  })

  const services = data?.services ?? []

  return (
    <>
      <SeoHead
        title="ZeroNix AV Solutions — Meeting Room & AV Integration Specialists | Dubai, UAE"
        description="ZeroNix AV delivers premium audio-visual integration across Dubai — meeting rooms, digital signage, surveillance, and IT infrastructure. Based in Al Quoz 1, Dubai."
        canonical="/"
      />

      <div className="pt-16">
        <HeroSlider />

        {/* ─── Brand Trust Strip ──────────────────────────────────────── */}
        <section className="border-b border-border bg-bg-surface py-6 sm:py-7">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
              Authorized Integrator for Leading AV Brands
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
              {BRANDS.map(brand => (
                <span key={brand} className="text-sm sm:text-base font-bold text-text-secondary/70 tracking-tight">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="py-16 sm:py-24 space-y-20 sm:space-y-28">
          {/* ─── Bento Solutions Grid ─────────────────────────────────── */}
          <section id="solutions" className="max-w-7xl mx-auto px-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  <Sparkles size={13} />
                  Our Solutions
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary mt-1.5 tracking-tight">
                  Everything Your Space Needs
                </h2>
              </div>
              <p className="text-sm text-text-secondary max-w-sm">
                Turnkey AV systems from design and installation to Dubai-based SLA support — five core solution categories, one integration partner.
              </p>
            </div>

            {isLoading ? <SolutionsGridSkeleton /> : <BentoGrid services={services} />}
          </section>

          {/* ─── Mixed Services + Products Rail ──────────────────────── */}
          {isLoading ? (
            <div className="max-w-7xl mx-auto px-6 space-y-16 sm:space-y-20">
              {Array.from({ length: 3 }).map((_, i) => (
                <section key={`carousel-skeleton-${i}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-3 w-40 bg-bg-surface rounded" />
                      <div className="h-7 w-56 bg-bg-surface rounded" />
                    </div>
                    <div className="h-4 w-32 bg-bg-surface rounded" />
                  </div>
                  <ProductCarouselSkeleton />
                </section>
              ))}
            </div>
          ) : isError || services.length === 0 ? (
            <div className="max-w-7xl mx-auto px-6">
              <div className="p-10 rounded-2xl border border-border bg-bg-surface text-center text-text-secondary text-sm">
                {isError
                  ? "We couldn't load our product catalog right now. Please refresh the page or check back shortly."
                  : 'No solutions are available yet. Please check back shortly.'}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 space-y-16 sm:space-y-20">
              {services.map((service) => (
                <section key={`carousel-${service.id || service.slug}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        Recommended Hardware
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary mt-0.5">
                        {service.title}
                      </h3>
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors shrink-0"
                    >
                      View all {service.products?.length || 0} products
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {service.products && service.products.length > 0 ? (
                    <ProductCarousel products={service.products} />
                  ) : (
                    <div className="p-8 rounded-2xl border border-border bg-bg-surface text-center text-text-secondary text-sm">
                      No linked products pre-loaded for this category yet. Explore the full catalog on the service page.
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* ─── Regional Promotions (country-targeted, admin-managed) ── */}
          <CountryBannerStrip />

          {/* ─── Why Choose ZeroNix ───────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Why Dubai Businesses Choose Us
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary mt-1.5 tracking-tight">
                Built for Enterprise Reliability
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: <Award size={20} />, title: 'Certified Engineering', body: 'CTS, CTS-D, and CTS-I certified engineers overseeing every phase from acoustic simulation to DSP tuning.' },
                { icon: <Cpu size={20} />, title: 'Tier-1 Brand Partnerships', body: 'Authorized integrator for Yealink, Hikvision, Samsung, LG, Shure, Crestron, and Extron across Dubai.' },
                { icon: <Headset size={20} />, title: '24/7 SLA & Hot-Swap', body: 'Dedicated rapid-response units with local warehouse replacement stock in Al Quoz, Dubai.' },
                { icon: <ShieldCheck size={20} />, title: 'SIRA & Compliance Ready', body: 'Every surveillance and access deployment engineered to meet Dubai civil defense and SIRA standards.' },
              ].map((f) => (
                <div key={f.title} className="p-6 rounded-2xl border border-border bg-bg-raised space-y-3">
                  <div className="w-11 h-11 rounded-full bg-accent-muted flex items-center justify-center text-accent">
                    {f.icon}
                  </div>
                  <h4 className="font-semibold text-text-primary">{f.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Closing CTA Banner ───────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-8 sm:p-14 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block">
                    Serving Dubai & The GCC
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Ready to upgrade your space?
                  </h3>
                  <p className="text-sm sm:text-base text-emerald-50/75 max-w-2xl">
                    From a single huddle room to a multi-branch rollout across the UAE, ZeroNix AV delivers standardized hardware, acoustic calibration, and single-point SLA support.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-white font-medium">
                    {['Free Dubai site visit', '3-year hardware warranty', '2-hour SLA response'].map(item => (
                      <span key={item} className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-300" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3">
                  <Link
                    to="/contact"
                    className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 text-sm font-semibold flex items-center justify-center gap-2 transition-all text-center"
                  >
                    Schedule a Consultation
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/solution-builder"
                    className="w-full py-3.5 px-6 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all text-center"
                  >
                    Try the AI Room Configurator
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
