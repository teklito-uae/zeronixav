import { Link } from 'react-router-dom'
import { Eye, CheckCircle2, ShieldCheck, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/types/api'
import { useCountryStore } from '@/stores/countryStore'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/currency'

interface ProductCardProps {
  product: Product
  onQuoteRequest?: (product: Product) => void
}

export default function ProductCard({ product, onQuoteRequest }: ProductCardProps) {
  const country = useCountryStore(s => s.country)
  const imageUrl = product.first_image || product.images?.[0] || 'https://placehold.co/600x450/ECFDF5/059669?text=AV+Hardware'
  const formattedPrice = formatPrice(Number(product.price), country)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    useCartStore.getState().addItem({
      productId: product.id,
      sku: product.sku,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      price: Number(product.price),
      image: imageUrl,
    })
    onQuoteRequest?.(product)
    toast.success('Added to cart')
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-bg-raised transition-all duration-200 hover:border-accent/40 hover:shadow-card overflow-hidden h-full">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="relative aspect-[4/3] w-full bg-bg-surface overflow-hidden flex items-center justify-center p-5 sm:p-6">
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
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
        <Link to={`/products/${product.slug}`} className="flex-1 mb-3">
          <h3 className="font-semibold text-sm sm:text-base text-text-primary group-hover:text-accent transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Stock & Warranty */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1 text-success font-medium">
            <CheckCircle2 size={12} />
            {product.stock > 0 ? 'In Dubai Warehouse' : 'Available on Order'}
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <ShieldCheck size={12} className="text-accent" />
            {product.warranty || '3-Yr Warranty'}
          </span>
        </div>

        {/* Price & Action */}
        <div className="pt-3.5 border-t border-border mt-auto space-y-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Price</div>
            <div className="font-bold text-sm sm:text-base text-text-primary">
              {formattedPrice}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <Eye size={13} />
              View
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
            >
              <ShoppingCart size={13} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
