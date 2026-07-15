import { useMemo, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import {
  ArrowRight,
  Camera,
  Cable,
  ChevronRight,
  Cloud,
  HelpCircle,
  LayoutPanelTop,
  Mic2,
  MonitorSmartphone,
  MousePointerClick,
  PenTool,
  PhoneCall,
  Speaker,
  Tag,
  Wand2,
  Wifi,
  CheckCircle2,
} from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import FaqAccordion from '@/components/ui/FaqAccordion'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProductSpotlightImage, { type Hotspot } from '@/components/ui/ProductSpotlightImage'
import { api } from '@/lib/api'
import { resolveTeamSpaceSlug } from '@/lib/teamSpaceSlugs'
import conferenceRoomSpotlight from '@/assets/solutions/conference-room/b2b-solution-conference-room.webp'
import huddleSpaceBg from '@/assets/solutions/b2b-solution-huddle-space-thumbnail.webp'
import ideationSpaceBg from '@/assets/solutions/b2b-solution-ideation-space-thumbnail-0923.webp'
import immersiveVideoRoomsBg from '@/assets/solutions/b2b-solution-immersive-video-rooms-thumbnail.webp'
import type { Service } from '@/types/api'

const SITE_URL = 'https://zeronixav.com'

const PRODUCT_SNIPPET_RE = /\[\[products:[\d,\s]+]]/g

interface FeatureItem {
  icon: ReactNode
  title: string
  description: string
}

interface RoomSizeTier {
  label: string
  scale: string
  description: string
}

interface SpacePresentation {
  headline: string
  heroImage: string
  heroCaption: string
  hotspots: Hotspot[]
  highlights: FeatureItem[]
  roomSizes: RoomSizeTier[]
}

const SPACE_PRESENTATION: Record<string, SpacePresentation> = {
  'conference-room-av-solutions-dubai': {
    headline: 'Built for the boardroom. Seen. Heard. Understood.',
    heroImage: conferenceRoomSpotlight,
    heroCaption: 'Hover or tap the highlighted points to see what powers this room.',
    hotspots: [
      { id: 'display', label: 'Interactive Display', x: 22, y: 25 },
      { id: 'video-bar', label: 'Video Bar (Camera + Speakers)', x: 22, y: 44 },
      { id: 'mic-puck', label: 'Tabletop Speakerphone', x: 54, y: 53 },
      { id: 'touch-panel', label: 'Room Scheduling Touch Panel', x: 61, y: 62 },
      { id: 'whiteboard', label: 'Digital Whiteboard', x: 88, y: 32 },
    ],
    highlights: [
      { icon: <MonitorSmartphone size={20} />, title: 'Interactive Display', description: 'A 4K display anchors the room, framing shared content and remote participants at a size everyone at the table can read.' },
      { icon: <Camera size={20} />, title: 'Video Bar (Camera + Speakers)', description: 'An all-in-one camera and speaker bar captures wide-angle video and clear audio without a rack of separate components.' },
      { icon: <Mic2 size={20} />, title: 'Tabletop Speakerphone', description: 'A centered microphone and speaker puck picks up every voice at the table and levels out cross-talk automatically.' },
      { icon: <MousePointerClick size={20} />, title: 'Room Scheduling Touch Panel', description: 'A single tap starts the scheduled call — no logins, no cables, no waiting for the meeting to boot up.' },
    ],
    roomSizes: [
      { label: 'Standard Boardroom', scale: '8–12 Seats', description: 'A single front-of-room PTZ camera and table speakerphone cover every voice around the table clearly.' },
      { label: 'Extended Boardroom', scale: '14–20 Seats', description: 'Ceiling microphone arrays and a secondary confidence monitor keep the far end of the table in frame.' },
      { label: 'Executive Boardroom', scale: '20–30+ Seats', description: 'Dual cameras, distributed ceiling audio, and AV-over-IP switching handle multi-screen presentations.' },
    ],
  },
  'huddle-space-av-solutions-dubai': {
    headline: 'Small rooms. Zero friction. Every quick call sorted.',
    heroImage: huddleSpaceBg,
    heroCaption: 'A compact, all-in-one kit built for fast ad-hoc meetings.',
    hotspots: [],
    highlights: [
      { icon: <Speaker size={20} />, title: 'All-in-One Video Bar', description: 'Camera, speaker, and microphone in a single unit — built for 2-6 person rooms with no separate components to wire.' },
      { icon: <Cable size={20} />, title: 'Single-Cable Install', description: 'One cable simplifies deployment across dozens of small rooms, cutting installation time to hours, not days.' },
      { icon: <LayoutPanelTop size={20} />, title: 'Consistent Kit, Every Room', description: 'The same standardized hardware across your floor means one support playbook for your whole IT team.' },
      { icon: <Wifi size={20} />, title: 'Instant Wireless Casting', description: 'Walk in and share a screen from any laptop or phone — no dongles or cables to hunt for.' },
    ],
    roomSizes: [
      { label: '2–3 Person Pod', scale: 'Phone booth / focus room', description: 'A single all-in-one video bar and a tap controller cover the whole space.' },
      { label: '4–6 Person Huddle Room', scale: 'Small meeting room', description: 'A wider-angle bar plus a dedicated tap controller keeps one-touch join reliable.' },
      { label: 'Open-Plan Cluster', scale: 'Multiple pods, one floor', description: 'The same kit repeated room to room, so every space is supported the same way.' },
    ],
  },
  'ideation-space-av-solutions-dubai': {
    headline: 'Open spaces built for ideas that move fast.',
    heroImage: ideationSpaceBg,
    heroCaption: 'Interactive displays built for real-time sketching and shared content.',
    hotspots: [],
    highlights: [
      { icon: <PenTool size={20} />, title: 'Interactive Touch Displays', description: 'Large-format multitouch panels turn any wall into a shared canvas for real-time sketching and annotation.' },
      { icon: <Wand2 size={20} />, title: 'Wireless Content Sharing', description: 'Present from any device the moment you walk in — no cabling, no adapters, no setup delay.' },
      { icon: <Cloud size={20} />, title: 'Cloud Whiteboard Sync', description: 'Session annotations save automatically, so ideas survive long after the room empties out.' },
      { icon: <LayoutPanelTop size={20} />, title: 'Mobile or Wall-Mounted', description: 'Flexible mounting adapts the same display to changing floor plans and team sizes.' },
    ],
    roomSizes: [
      { label: 'Single Team Zone', scale: '4–8 People', description: 'One interactive display on a mobile cart, easy to reposition between teams.' },
      { label: 'Open Collaboration Area', scale: '8–15 People', description: 'A wall-mounted display paired with wireless presentation switching for drop-in sessions.' },
      { label: 'Multi-Zone Studio', scale: '15+ People', description: 'Several linked displays with shared content sync across breakout clusters.' },
    ],
  },
  'immersive-video-rooms-av-solutions-dubai': {
    headline: 'Furniture and camera, engineered as one system.',
    heroImage: immersiveVideoRoomsBg,
    heroCaption: 'Flagship rooms where seating and camera framing are designed together.',
    hotspots: [],
    highlights: [
      { icon: <Camera size={20} />, title: 'Engineered Camera & Seating', description: 'Furniture layout and camera framing are designed together, so every in-room participant reads naturally on camera.' },
      { icon: <LayoutPanelTop size={20} />, title: 'Large-Format Display', description: 'LED walls or 85-inch-plus commercial displays render remote participants at life-size scale, not a shrunken panel.' },
      { icon: <Cable size={20} />, title: 'AV-over-IP Distribution', description: 'Flexible signal routing scales from a single flagship room to a multi-display video wall.' },
      { icon: <Mic2 size={20} />, title: 'Broadcast-Grade Audio Matrix', description: 'Automatic mixing keeps every voice balanced across the room during hybrid calls.' },
    ],
    roomSizes: [
      { label: 'Flagship Meeting Room', scale: '10–16 Seats', description: 'A large-format display engineered alongside the seating layout for natural eye lines.' },
      { label: 'Executive Boardroom', scale: '16–24 Seats', description: 'An LED video wall with matrix-routed, multi-camera framing for wide tables.' },
      { label: 'Town Hall Room', scale: '24+ Seats', description: 'A broadcast-grade audio matrix and multi-display routing for hybrid all-hands.' },
    ],
  },
}

const DEFAULT_PRESENTATION = SPACE_PRESENTATION['conference-room-av-solutions-dubai']

export default function TeamSpaceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const teamSpaceSlug = slug || 'conference-rooms'
  const apiSlug = resolveTeamSpaceSlug(teamSpaceSlug)
  const presentation = SPACE_PRESENTATION[apiSlug] || DEFAULT_PRESENTATION

  const { data: service, isLoading, isError } = useQuery<Service>({
    queryKey: ['service', apiSlug],
    queryFn: () => api.get<Service>(`/api/v1/services/${apiSlug}`),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const title = service?.title || ''
  const summary = service?.summary || ''
  const content = service?.content || ''
  const faqs = service?.faqs || []
  const keywords = service?.keywords || []
  const seoTitle = service?.seo_title || `${title} | ZeroNix AV Solutions`
  const seoDesc = service?.seo_description || summary
  const canonicalPath = `/teamspace/${teamSpaceSlug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const overviewMarkdown = useMemo(() => content.replace(PRODUCT_SNIPPET_RE, '').trim(), [content])

  const jsonLd = useMemo(() => {
    if (!service) return []
    const blocks: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: title,
        name: title,
        description: summary || seoDesc,
        url: canonicalUrl,
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
          { '@type': 'ListItem', position: 2, name: 'Team Workspaces', item: `${SITE_URL}/#solutions` },
          { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
        ],
      },
    ]
    if (faqs.length > 0) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      })
    }
    return blocks
  }, [service, title, summary, seoDesc, canonicalUrl, faqs])

  if (isLoading) {
    return (
      <div className="pt-24 sm:pt-[8.25rem] min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div className="pt-32 sm:pt-[10.25rem] pb-24 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-2xl font-bold text-text-primary">We couldn't find that workspace.</h1>
        <p className="text-sm text-text-secondary max-w-md">
          This team workspace may have moved. Explore all the spaces we design for from the homepage.
        </p>
        <Link
          to="/#solutions"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all"
        >
          Back to Team Workspaces
        </Link>
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

      <div className="pb-24 sm:pb-28 pt-28 sm:pt-[10.25rem]">
        {/* ─── Hero: intro copy + interactive product-spotlight image ─── */}
        <section className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-4">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/#solutions" className="hover:text-accent transition-colors">Team Workspaces</Link>
              <ChevronRight size={12} />
              <span className="text-text-secondary truncate max-w-[220px] sm:max-w-none">{title}</span>
            </nav>

            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent">
              Team Workspaces
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary leading-[1.15] tracking-tight">
              {presentation.headline}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {summary}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <a
                href="#explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-bg-surface hover:border-accent text-text-primary font-semibold text-sm transition-all"
              >
                Learn More
              </a>
              <Link
                to="/solution-builder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-lg shadow-emerald-900/20 transition-all"
              >
                Design Your Space
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div>
            <ProductSpotlightImage image={presentation.heroImage} alt={title} hotspots={presentation.hotspots} />
            <p className="text-xs text-text-muted text-center mt-3">{presentation.heroCaption}</p>
          </div>
        </section>

        {/* ─── Explanation content ────────────────────────────────────── */}
        <section id="explore" className="max-w-3xl mx-auto px-6 pt-16 sm:pt-20 space-y-16">
          {overviewMarkdown && (
            <div className="prose max-w-none">
              <ReactMarkdown>{overviewMarkdown}</ReactMarkdown>
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">What's In This Room</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                The Hardware Behind a {title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {presentation.highlights.map((item) => (
                <div key={item.title} className="p-6 rounded-2xl border border-border bg-bg-surface space-y-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-accent-muted text-accent">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Scales With Your Room</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Sized From a Single Room to a Full Floor
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {presentation.roomSizes.map((tier) => (
                <div key={tier.label} className="p-6 rounded-2xl border border-border bg-bg-raised space-y-2">
                  <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">{tier.scale}</span>
                  <h3 className="text-sm font-bold text-text-primary">{tier.label}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ Section ─────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="mt-20 py-16 sm:py-20 bg-bg-surface border-y border-border">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center space-y-2 mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-muted border border-accent/15 text-xs text-accent uppercase tracking-wider font-semibold">
                  <HelpCircle size={13} />
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Common questions about {title}
                </h2>
                <p className="text-sm text-text-secondary max-w-xl mx-auto">
                  Answers our Dubai and UAE clients ask most before designing this space.
                </p>
              </div>
              <FaqAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* ─── Keyword Pills ───────────────────────────────────────── */}
        {keywords.length > 0 && (
          <section className="max-w-3xl mx-auto px-6 pt-16 sm:pt-20">
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
        <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20">
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
                  {['Free on-site UAE assessment', '3-year hardware warranty', '2-hour SLA response'].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-300" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  to="/solution-builder"
                  className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 text-sm font-semibold flex items-center justify-center gap-2 transition-all text-center"
                >
                  Design Your Space
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="w-full py-3.5 px-6 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all text-center"
                >
                  <PhoneCall size={14} className="inline mr-1.5 -mt-0.5" />
                  Talk to an Expert
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
