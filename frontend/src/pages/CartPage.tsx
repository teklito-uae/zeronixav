import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import { useCartStore } from '@/stores/cartStore'
import { useCountryStore } from '@/stores/countryStore'
import { formatPrice } from '@/lib/currency'

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)
  const country = useCountryStore(s => s.country)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <>
      <SeoHead
        title="Your Cart — ZeroNix AV Solutions"
        description="Review the AV hardware in your cart before checking out with Cash on Delivery."
        canonical="/cart"
      />

      <div className="pt-20 sm:pt-[7.25rem] pb-24 sm:pb-28 max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Your Cart
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            {items.length > 0
              ? `${items.length} product${items.length > 1 ? 's' : ''} in your cart`
              : 'Your cart is currently empty.'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="p-14 rounded-2xl border border-border bg-bg-surface text-center max-w-xl mx-auto">
            <ShoppingCart className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary mb-5">Your cart is empty.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors"
            >
              Browse Products
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Line items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map(item => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-bg-raised"
                >
                  <Link
                    to={`/products/${item.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-bg-surface flex items-center justify-center p-3 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x450/ECFDF5/059669?text=ZeroNix+AV'
                      }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-accent tracking-wide">
                      {item.brand}
                    </span>
                    <Link to={`/products/${item.slug}`}>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-2 hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-text-muted mt-1">
                      {formatPrice(item.price, country)} each
                    </p>

                    {/* Mobile qty + remove */}
                    <div className="flex sm:hidden items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          onClick={() => updateQty(item.productId, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-text-secondary"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-text-primary">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-text-secondary"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-text-muted hover:text-danger transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop qty stepper */}
                  <div className="hidden sm:flex items-center border border-border rounded-full shrink-0">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-text-primary">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="hidden sm:block text-right shrink-0 w-28">
                    <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Subtotal</div>
                    <div className="text-sm font-bold text-text-primary">
                      {formatPrice(item.price * item.qty, country)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="hidden sm:flex p-2 text-text-muted hover:text-danger transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 p-6 rounded-2xl border border-border bg-bg-raised space-y-5">
                <h3 className="text-sm font-bold text-text-primary">Order Summary</h3>

                <div className="space-y-2 pb-4 border-b border-border text-sm">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text-primary">{formatPrice(subtotal, country)}</span>
                  </div>
                  <p className="text-[11px] text-text-muted pt-1">
                    Shipping and tax aren't calculated at this stage. Pay in cash on delivery.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">Total</span>
                  <span className="text-lg font-bold text-text-primary">{formatPrice(subtotal, country)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/products"
                  className="block text-center text-xs text-text-secondary hover:text-accent transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
