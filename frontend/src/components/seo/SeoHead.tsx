import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://zeronixav.com'

const GCC_LOCALES = [
  { hreflang: 'en-ae', path: '' },
  { hreflang: 'en-sa', path: '' },
  { hreflang: 'en-qa', path: '' },
  { hreflang: 'en-om', path: '' },
] as const

interface SeoHeadProps {
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
  /** One or more schema.org structured data objects, rendered as JSON-LD <script> tags. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export default function SeoHead({
  title = 'ZeroNix AV Solutions — Meeting Room & AV Integration Specialists | Dubai, UAE',
  description = 'ZeroNix AV delivers premium audio-visual integration across Dubai. Meeting rooms, digital signage, surveillance, and IT infrastructure. Al Quoz 1, Dubai.',
  canonical = '/',
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const canonicalUrl = `${BASE_URL}${canonical}`
  const jsonLdBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}

      {/* Open Graph */}
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content="ZeroNix AV Solutions" />

      {/* GCC hreflang alternates */}
      {GCC_LOCALES.map(locale => (
        <link
          key={locale.hreflang}
          rel="alternate"
          hrefLang={locale.hreflang}
          href={canonicalUrl}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  )
}
