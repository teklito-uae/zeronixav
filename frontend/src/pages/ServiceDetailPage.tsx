import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import {
  ChevronRight,
  CheckCircle2,
  Zap,
  PhoneCall,
  ArrowRight,
  MapPin,
  HelpCircle,
  Tag,
} from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import ProductCarousel from '@/components/ui/ProductCarousel'
import FaqAccordion from '@/components/ui/FaqAccordion'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { api } from '@/lib/api'
import { parseContentBlocks } from '@/lib/contentBlocks'
import heroBg from '@/assets/hero-bg/green-flash-hero-bg.jpg'
import type { Service, Product, ServiceFaq } from '@/types/api'

const SITE_URL = 'https://zeronixav.com'

const UAE_EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

// Fallback high-fidelity content for local development or disconnected API state
const MOCK_DETAIL_DATA: Record<string, {
  title: string; summary: string; content: string; seoTitle: string; seoDesc: string
  keywords: string[]; products: Product[]; faqs: ServiceFaq[]
}> = {
  'meeting-room-solutions-in-dubai': {
    title: 'Meeting Room Solutions in Dubai',
    summary: 'Turnkey native Microsoft Teams Rooms, Zoom Rooms, and Cisco Webex integration with acoustic treatment and zero-touch automation — installed and supported across Dubai and the wider UAE.',
    seoTitle: 'Meeting Room Solutions in Dubai | ZeroNix AV',
    seoDesc: 'Transform boardrooms with 4K video conferencing, ceiling array microphones, and zero-touch automation. Serving Dubai and the wider UAE.',
    keywords: ['meeting room AV Dubai', 'Microsoft Teams Rooms UAE', 'Zoom Rooms installation Dubai', 'boardroom AV integrator', 'huddle room solutions UAE', 'video conferencing Dubai'],
    content: `
### The Challenge

Most Dubai boardrooms run on mismatched hardware — echoing audio, tangled cabling, and touch panels that fail mid-call. Every new office becomes a one-off configuration your IT team has to relearn and support separately.

### The ZeroNix Solution

We deploy certified Microsoft Teams Rooms, Zoom Rooms, and Cisco Webex systems on one standardized hardware blueprint. From a 2-person huddle space to a 30-seat boardroom, every room runs the same tested Crestron and Yealink stack — so your team supports one system, not twenty.

[[products:101,103,105]]

### How We Work

1. **Assess** — On-site acoustic and network survey of your Dubai facility.
2. **Design** — A standardized room blueprint sized to your headcount and UC platform.
3. **Install** — Certified engineers commission each room in days, not weeks.
4. **Support** — 24/7 remote monitoring with a 2-hour on-site SLA across the UAE.
`,
    faqs: [
      { id: 1, question: 'What UC platforms do you support for meeting rooms in Dubai?', answer: 'We design and certify meeting rooms for Microsoft Teams Rooms, Zoom Rooms, and Cisco Webex, so your hardware works natively with the platform your Dubai office already standardizes on — no third-party bridging required.' },
      { id: 2, question: 'How long does a typical boardroom installation take in the UAE?', answer: 'A single boardroom in Dubai is typically surveyed, installed, and commissioned within 5-10 working days, including acoustic treatment and calendar/room-scheduler integration. Multi-branch UAE rollouts are scheduled in phased batches to avoid business disruption.' },
      { id: 3, question: 'Do you provide ongoing maintenance and support after installation?', answer: 'Yes. Every deployment includes SLA-backed maintenance with 24/7 cloud remote monitoring, automated firmware patching, and a 2-hour on-site hot-swap replacement guarantee across Dubai.' },
      { id: 4, question: 'Is the hardware compliant with UAE civil defense and SIRA regulations?', answer: 'All meeting room deployments follow UAE Civil Defense guidelines, and any integrated surveillance or access components are SIRA-compliant where applicable.' },
    ],
    products: [
      {
        id: 101,
        sku: 'YL-MVC840',
        title: 'Yealink MVC840 Microsoft Teams Rooms System for Large/Extra-Large Rooms',
        slug: 'yealink-mvc840-teams-room-system',
        brand: 'Yealink',
        description: 'Complete native Microsoft Teams Rooms bundle featuring 4K PTZ camera, MCore Pro Mini-PC, touch console, and VCM34 array microphones.',
        price: '14850.00',
        stock: 24,
        category_id: 1,
        tech_specs: { Resolution: '4K Ultra HD', Zoom: '12x Optical', Platform: 'Microsoft Teams Certified', Connectivity: 'PoE / HDMI / USB 3.0' },
        images: ['https://placehold.co/800x600/ECFDF5/059669?text=Yealink+MVC840']
      },
      {
        id: 103,
        sku: 'SHU-MXA920',
        title: 'Shure MXA920 Ceiling Array Microphone with IntelliMix DSP',
        slug: 'shure-mxa920-ceiling-array-microphone',
        brand: 'Shure',
        description: 'Automatic coverage ceiling array microphone providing steerable lobe positioning and pristine vocal capture without table clutter.',
        price: '21500.00',
        stock: 8,
        category_id: 4,
        tech_specs: { Audio: 'IntelliMix DSP', Coverage: '30x30 ft Automatic', Network: 'Dante / AES67 Audio', Mounting: 'Flush / Pole / Wire' },
        images: ['https://placehold.co/800x600/ECFDF5/059669?text=Shure+MXA920']
      },
      {
        id: 105,
        sku: 'CRE-NVX-360',
        title: 'Crestron DM NVX 4K60 4:4:4 HDR Network AV Encoder/Decoder',
        slug: 'crestron-dm-nvx-360-encoder-decoder',
        brand: 'Crestron',
        description: 'Zero-latency 4K60 AV-over-IP distribution point supporting HDR10, Dolby Vision, and enterprise 802.1x encryption over standard 1GbE network.',
        price: '6800.00',
        stock: 30,
        category_id: 5,
        tech_specs: { Latency: 'Sub-frame (<1ms)', Video: '4K60 4:4:4 HDR', Network: 'Standard 1Gb Ethernet', Security: '802.1X / AES-128' },
        images: ['https://placehold.co/800x600/ECFDF5/059669?text=Crestron+NVX360']
      }
    ]
  }
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const activeSlug = slug || 'meeting-room-solutions-in-dubai'

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['service', activeSlug],
    queryFn: () => api.get<Service>(`/api/v1/services/${activeSlug}`),
    retry: 1,
    staleTime: 5 * 60 * 1000
  })

  const mock = MOCK_DETAIL_DATA[activeSlug] || MOCK_DETAIL_DATA['meeting-room-solutions-in-dubai']
  const title = service?.title || mock.title
  const summary = service?.summary || mock.summary
  const products = service?.products?.length ? service.products : mock.products
  const faqs = service?.faqs?.length ? service.faqs : mock.faqs
  const keywords = service?.keywords?.length ? service.keywords : mock.keywords
  const seoTitle = service?.seo_title || mock.seoTitle
  const seoDesc = service?.seo_description || mock.seoDesc
  const content = service?.content || mock.content
  const canonicalPath = `/services/${activeSlug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const contentBlocks = useMemo(() => parseContentBlocks(content), [content])

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: title,
      name: title,
      description: summary || seoDesc,
      url: canonicalUrl,
      areaServed: UAE_EMIRATES.map((name) => ({ '@type': 'State', name })),
      provider: {
        '@type': 'Organization',
        name: 'ZeroNix AV Solutions',
        url: SITE_URL,
        telephone: '+97148009376',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Al Quoz 1',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE_URL}/#solutions` },
        { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
      ],
    },
    ...(faqs.length > 0
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }]
      : []),
  ]

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <SeoHead
        title={`${seoTitle} — ZeroNix AV Solutions`}
        description={seoDesc}
        canonical={canonicalPath}
        jsonLd={jsonLd}
      />

      <div className="pb-24 sm:pb-28">
        {/* ─── Hero: dark emerald backdrop blended with brand texture ─── */}
        <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-emerald-100/60">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/#solutions" className="hover:text-white transition-colors">Solutions</Link>
              <ChevronRight size={12} />
              <span className="text-emerald-100/90 truncate max-w-[220px] sm:max-w-none">{title}</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                UAE Turnkey AV Service
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-2xl">
                {summary}
              </p>
            </div>

            {/* Emirates coverage strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                <MapPin size={13} />
                Serving all 7 Emirates:
              </span>
              {UAE_EMIRATES.map((emirate) => (
                <span
                  key={emirate}
                  className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-zinc-200"
                >
                  {emirate}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all"
              >
                Request a Quote
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+97148009376"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold text-sm transition-all"
              >
                <PhoneCall size={15} />
                +971 (4) 800-ZERONIX
              </a>
            </div>
          </div>
        </section>

        {/* Main Content Body */}
        <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left/Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {contentBlocks.map((block) => {
              if (block.type === 'markdown') {
                return (
                  <div key={block.key} className="prose max-w-none">
                    <ReactMarkdown>{block.text}</ReactMarkdown>
                  </div>
                )
              }

              const blockProducts = block.ids
                .map((id) => products.find((p) => p.id === id))
                .filter((p): p is Product => Boolean(p))

              if (blockProducts.length === 0) return null

              return (
                <div key={block.key} className="rounded-2xl border border-border bg-bg-surface p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <span className="text-xs text-accent uppercase tracking-wider font-semibold">
                        Recommended Hardware
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-text-primary mt-0.5">
                        Curated Equipment for This Solution
                      </h3>
                    </div>
                    <span className="text-xs text-text-muted">
                      Direct Tier-1 Brand Partnerships
                    </span>
                  </div>
                  <ProductCarousel products={blockProducts} dense />
                </div>
              )
            })}
          </div>

          {/* Right Sidebar: Engineering Assurance & CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-bg-raised space-y-6 shadow-card">
              <div className="space-y-2">
                <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">
                  UAE-Wide SLA Guarantee
                </span>
                <h4 className="text-lg font-semibold text-text-primary">
                  Ready to Deploy in Your Space?
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Schedule an on-site acoustic and architectural assessment with our CTS-certified integration team in Dubai.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>SIRA & Civil Defense Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>3-Year Advance Hardware Replacement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>24/7 Cloud Remote Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-accent shrink-0" />
                  <span>On-site teams across all 7 Emirates</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/contact"
                  className="w-full py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <PhoneCall size={14} />
                  Request a Quote
                </Link>

                <Link
                  to="/solution-builder"
                  className="w-full py-3 rounded-full border border-border bg-bg-primary hover:border-accent text-text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Zap size={14} className="text-accent" />
                  Configure via AI Builder
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-bg-surface border border-border text-center">
                <span className="text-[11px] text-text-muted block mb-1">Direct Engineering Hotline</span>
                <a href="tel:+97148009376" className="text-sm font-bold text-accent hover:underline">
                  +971 (4) 800-ZERONIX
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FAQ Section ─────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="mt-20 py-16 sm:py-20 bg-bg-surface border-y border-border">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center space-y-2 mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-muted border border-accent/15 text-xs text-accent uppercase tracking-wider font-semibold">
                  <HelpCircle size={13} />
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Common questions about {title}
                </h2>
                <p className="text-sm text-text-secondary max-w-xl mx-auto">
                  Answers our Dubai and UAE clients ask most before deploying this solution.
                </p>
              </div>
              <FaqAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* ─── Keyword Pills ───────────────────────────────────────── */}
        {keywords.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pt-16 sm:pt-20">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Tag size={13} />
              Related Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1.5 rounded-full border border-border bg-bg-surface text-xs text-text-secondary"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ─── Closing CTA Banner ──────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pt-16 sm:pt-20">
          <div className="rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-8 sm:p-14 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block">
                  Serving Dubai & The Wider UAE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to bring {title} to your space?
                </h3>
                <p className="text-sm sm:text-base text-emerald-50/75 max-w-2xl">
                  From a single room to a multi-emirate rollout, ZeroNix AV delivers standardized hardware, certified engineering, and single-point SLA support across the UAE.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-white font-medium">
                  {['Free on-site UAE assessment', '3-year hardware warranty', '2-hour SLA response'].map(item => (
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
    </>
  )
}
