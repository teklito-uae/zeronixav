import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import type { Product } from '@/types/api'
import { useCountryStore } from '@/stores/countryStore'
import { formatPrice } from '@/lib/currency'

interface ProductCardProps {
  product: Product
  onQuoteRequest?: (product: Product) => void
}

export default function ProductCard({ product, onQuoteRequest }: ProductCardProps) {
  const country = useCountryStore(s => s.country)
  const imageUrl = product.first_image || product.images?.[0] || 'https://placehold.co/600x450/ECFDF5/059669?text=AV+Hardware'
  const formattedPrice = formatPrice(Number(product.price), country)

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-bg-raised transition-all duration-200 hover:border-accent/40 hover:shadow-card overflow-hidden h-full">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="relative aspect-[4/3] w-full bg-bg-surface overflow-hidden block">
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x450/ECFDF5/059669?text=ZeroNix+AV'
          }}
        />
        <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide text-accent px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
          {product.brand}
        </span>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm sm:text-base text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-1.5">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-text-secondary line-clamp-2 mb-3 flex-1">
          {product.description || 'Enterprise-grade audio visual integration hardware built for mission-critical Dubai installations.'}
        </p>

        {/* Stock & Warranty */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1 text-success font-medium">
            <CheckCircle2 size={12} />
            {product.stock > 0 ? 'In Dubai Warehouse' : 'Available on Order'}
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <ShieldCheck size={12} className="text-accent" />
            3-Yr Warranty
          </span>
        </div>

        {/* Price & Action */}
        <div className="pt-3.5 border-t border-border flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Price</div>
            <div className="font-bold text-sm sm:text-base text-text-primary">
              {formattedPrice}
            </div>
          </div>

          <Link
            to={`/contact?sku=${encodeURIComponent(product.sku)}&title=${encodeURIComponent(product.title)}`}
            onClick={() => onQuoteRequest?.(product)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm shrink-0"
          >
            Get Quote
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
