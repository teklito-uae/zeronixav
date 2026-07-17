import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Banknote, PackageX, ArrowRight } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { api } from '@/lib/api'

interface OrderItem {
  id: number
  product_id: number
  sku: string
  title: string
  price: string
  quantity: number
  line_total: string
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  email: string
  phone: string
  company: string | null
  country: string
  address_line1: string
  address_line2: string | null
  city: string
  notes: string | null
  payment_method: string
  status: string
  subtotal: string
  total: string
  items: OrderItem[]
  created_at: string
}

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()

  const { data, isLoading, isError } = useQuery<{ order: Order }>({
    queryKey: ['order', orderNumber],
    queryFn: () => api.get<{ order: Order }>(`/api/v1/orders/${orderNumber}`),
    enabled: !!orderNumber,
    retry: 1,
  })

  const order = data?.order

  if (isLoading) {
    return (
      <div className="pt-24 sm:pt-[8.25rem] min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <>
        <SeoHead
          title="Order Not Found — ZeroNix AV Solutions"
          description="We couldn't find this order."
          canonical="/order-confirmation"
        />
        <div className="pt-24 sm:pt-[8.25rem] pb-24 sm:pb-28 max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/25 flex items-center justify-center text-danger mx-auto mb-5">
            <PackageX size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">We couldn't find that order</h1>
          <p className="text-sm text-text-secondary mb-6">
            The order number may be incorrect, or the order is no longer available.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors"
          >
            Continue Shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={`Order ${order.order_number} Confirmed — ZeroNix AV Solutions`}
        description="Your Cash on Delivery order has been confirmed."
        canonical={`/order-confirmation/${order.order_number}`}
      />

      <div className="pt-20 sm:pt-[7.25rem] pb-24 sm:pb-28 max-w-3xl mx-auto px-6">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/25 flex items-center justify-center text-success mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Thanks — your order is confirmed</h1>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              A confirmation has been recorded for your Cash on Delivery order. Our Dubai desk will reach out to coordinate delivery.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-muted border border-accent/15 text-sm font-semibold text-accent">
            Order #{order.order_number}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-bg-raised space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-border">
            <Banknote size={20} className="text-accent shrink-0" />
            <p className="text-sm text-text-primary font-medium">Pay in cash on delivery</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary mb-3">Order Items</h3>
            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-3.5 text-sm">
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium line-clamp-1">{item.title}</p>
                    <p className="text-xs text-text-muted">SKU: {item.sku} &middot; Qty {item.quantity} &times; AED {Number(item.price).toLocaleString('en-AE', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="font-semibold text-text-primary shrink-0">
                    AED {Number(item.line_total).toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
              <span className="text-sm font-semibold text-text-primary">Total</span>
              <span className="text-lg font-bold text-text-primary">
                AED {Number(order.total).toLocaleString('en-AE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary mb-3">Shipping Address</h3>
            <div className="p-4 rounded-xl bg-bg-surface border border-border text-sm text-text-secondary space-y-1">
              <p className="text-text-primary font-semibold">{order.customer_name}</p>
              {order.company && <p>{order.company}</p>}
              <p>{order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}</p>
              <p>{order.city}, {order.country}</p>
              <p>{order.email} &middot; {order.phone}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-all"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
