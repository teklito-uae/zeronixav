import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight, PhoneCall, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import SeoHead from '@/components/seo/SeoHead'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProductCarousel from '@/components/ui/ProductCarousel'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import type { Product, PaginatedResponse } from '@/types/api'

const MOCK_PRODUCT: Product = {
  id: 101,
  sku: 'YL-MVC840',
  title: 'Yealink MVC840 Microsoft Teams Rooms System for Large/Extra-Large Rooms',
  slug: 'yealink-mvc840-teams-room-system',
  brand: 'Yealink',
  description: 'Complete native Microsoft Teams Rooms bundle featuring a 4K PTZ camera, MCore Pro Mini-PC, touch console, and VCM34 array microphones. Engineered for large and extra-large Dubai boardrooms requiring certified Microsoft Teams Rooms compliance out of the box.',
  price: '14850.00',
  stock: 24,
  category_id: 1,
  tech_specs: {
    Resolution: '4K Ultra HD',
    Zoom: '12x Optical + 3x Digital',
    Platform: 'Microsoft Teams Certified',
    Connectivity: 'PoE / HDMI / USB 3.0',
    'Room Size': 'Large / Extra-Large (up to 30 seats)',
    Warranty: '3-Year Enterprise Warranty',
  },
  images: [
    'https://placehold.co/900x680/ECFDF5/059669?text=Yealink+MVC840',
    'https://placehold.co/900x680/D1FAE5/059669?text=Rear+Panel',
  ],
  first_image: 'https://placehold.co/900x680/ECFDF5/059669?text=Yealink+MVC840',
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const activeSlug = slug || MOCK_PRODUCT.slug
  const [activeImage, setActiveImage] = useState(0)

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', activeSlug],
    queryFn: () => api.get<Product>(`/api/v1/products/${activeSlug}`),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const item = product || MOCK_PRODUCT
  const images = item.images && item.images.length > 0 ? item.images : [item.first_image || MOCK_PRODUCT.first_image!]

  const { data: relatedData } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['related-products', item.category_id],
    queryFn: () => api.get<PaginatedResponse<Product>>('/api/v1/products', { category: item.category_id }),
    enabled: !!item.category_id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
  const related = (relatedData?.data || []).filter(p => p.slug !== item.slug).slice(0, 10)

  const formattedPrice = Number(item.price) > 0
    ? `AED ${Number(item.price).toLocaleString('en-AE', { minimumFractionDigits: 2 })}`
    : 'Request Quote'

  const handleAddToCart = () => {
    useCartStore.getState().addItem({
      productId: item.id,
      sku: item.sku,
      slug: item.slug,
      title: item.title,
      brand: item.brand,
      price: Number(item.price),
      image: images[0],
    })
    toast.success('Added to cart')
  }

  if (isLoading) {
    return (
      <div className="pt-24 sm:pt-[8.25rem] min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <SeoHead
        title={`${item.title} | ${item.brand} — ZeroNix AV Dubai`}
        description={item.description || `${item.title} available in Dubai from ZeroNix AV Solutions. Request an enterprise quote today.`}
        canonical={`/products/${activeSlug}`}
      />

      <div className="pt-20 sm:pt-[7.25rem] pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <Link to="/#solutions" className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            Back to Solutions
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">
          {/* Gallery */}
          <div className="lg:col-span-6 space-y-3">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-bg-surface flex items-center justify-center p-8 sm:p-10">
              <img
                src={images[activeImage]}
                alt={item.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/900x680/ECFDF5/059669?text=ZeroNix+AV' }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-14 shrink-0 rounded-xl overflow-hidden border-2 bg-bg-surface flex items-center justify-center p-1.5 transition-colors ${i === activeImage ? 'border-accent' : 'border-border'}`}
                  >
                    <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-muted border border-accent/15 text-xs font-semibold uppercase tracking-wider text-accent">
                {item.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-tight tracking-tight">
                {item.title}
              </h1>
              <p className="text-sm text-text-muted">SKU: {item.sku}</p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary py-4 border-y border-border">
              <span className="flex items-center gap-1.5 text-success font-medium">
                <CheckCircle2 size={14} />
                {item.stock > 0 ? 'In Dubai Warehouse' : 'Available on Order'}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                {item.warranty || '3-Year Enterprise Warranty'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-semibold text-text-muted tracking-wider">Price</div>
                <div className="text-2xl font-bold text-text-primary">{formattedPrice}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-all"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
              <Link
                to={`/contact?sku=${encodeURIComponent(item.sku)}&title=${encodeURIComponent(item.title)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border bg-bg-surface hover:border-accent text-text-primary font-semibold text-sm transition-all"
              >
                Request a Quote
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+971567850662"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border bg-bg-surface hover:border-accent text-text-primary font-semibold text-sm transition-all"
              >
                <PhoneCall size={15} className="text-accent" />
                Call Dubai Desk
              </a>
            </div>

            {/* Tech Specs */}
            {item.tech_specs && Object.keys(item.tech_specs).length > 0 && (
              <div className="rounded-2xl border border-border bg-bg-surface overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h3 className="text-sm font-semibold text-text-primary">Technical Specifications</h3>
                </div>
                <div className="divide-y divide-border">
                  {Object.entries(item.tech_specs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-text-secondary capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-text-primary text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overview & Long Description */}
        {(item.overview || item.long_description) && (
          <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
            {item.overview && (
              <div className="rounded-2xl border border-border bg-bg-surface overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h3 className="text-sm font-semibold text-text-primary">Overview</h3>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {item.overview}
                  </p>
                </div>
              </div>
            )}

            {item.long_description && (
              <div className="rounded-2xl border border-border bg-bg-surface overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h3 className="text-sm font-semibold text-text-primary">Product Details</h3>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {item.long_description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
              You May Also Need
            </h3>
            <ProductCarousel products={related} />
          </div>
        )}
      </div>
    </>
  )
}
