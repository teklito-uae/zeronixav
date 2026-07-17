import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Truck, CreditCard, ClipboardCheck, Check, Banknote, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { useCountryStore } from '@/stores/countryStore'
import { formatPrice } from '@/lib/currency'

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

type Step = 'shipping' | 'payment' | 'review'

const STEPS: { key: Step; label: string; icon: typeof Truck }[] = [
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
]

interface ShippingForm {
  customer_name: string
  email: string
  phone: string
  company: string
  country: string
  address_line1: string
  address_line2: string
  city: string
  notes: string
}

const EMPTY_FORM: ShippingForm = {
  customer_name: '',
  email: '',
  phone: '',
  company: '',
  country: 'UAE',
  address_line1: '',
  address_line2: '',
  city: '',
  notes: '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore(s => s.items)
  const country = useCountryStore(s => s.country)

  const [step, setStep] = useState<Step>('shipping')
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [placed, setPlaced] = useState(false)
  // A ref (not state) because `clear()` below notifies this component's
  // `items` subscription synchronously, ahead of the `setPlaced(true)`
  // state update — this effect must see "placed" immediately, not after
  // React's next render, or it races the post-order navigate() below and
  // bounces the user back to /cart right after landing on the confirmation
  // page.
  const placedRef = useRef(false)

  useEffect(() => {
    if (items.length === 0 && !placedRef.current) {
      navigate('/cart')
    }
  }, [items.length, navigate])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const stepIndex = STEPS.findIndex(s => s.key === step)

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.post<{ order: Order }>('/api/v1/checkout', {
        customer_name: form.customer_name,
        email: form.email,
        phone: form.phone,
        company: form.company || null,
        country: form.country,
        address_line1: form.address_line1,
        address_line2: form.address_line2 || null,
        city: form.city,
        notes: form.notes || null,
        payment_method: 'cod',
        items: items.map(i => ({ product_id: i.productId, quantity: i.qty })),
      })

      placedRef.current = true
      setPlaced(true)
      useCartStore.getState().clear()
      navigate(`/order-confirmation/${response.order.order_number}`)
    } catch {
      setError('We could not place your order right now. Please check your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !placed) {
    return null
  }

  return (
    <>
      <SeoHead
        title="Checkout — ZeroNix AV Solutions"
        description="Complete your Cash on Delivery order for enterprise AV hardware from ZeroNix AV Solutions."
        canonical="/checkout"
      />

      <div className="pt-20 sm:pt-[7.25rem] pb-24 sm:pb-28 max-w-5xl mx-auto px-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-8 sm:mb-10">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10 sm:mb-12">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = i === stepIndex
            const isDone = i < stepIndex
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive
                        ? 'border-accent bg-accent text-white'
                        : isDone
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border bg-bg-surface text-text-muted'
                    }`}
                  >
                    {isDone ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-[11px] font-semibold ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-4 mb-5 transition-colors ${isDone ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/25 text-xs text-danger">
            {error}
          </div>
        )}

        <div className="p-6 sm:p-10 rounded-2xl border border-border bg-bg-raised shadow-card">
          {/* Step 1: Shipping */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Full Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Emirates Holding Group"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Work Email <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="t.almansoor@emiratesgroup.ae"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Phone / WhatsApp <span className="text-accent">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Country <span className="text-accent">*</span>
                  </label>
                  <select
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="UAE">United Arab Emirates (Dubai / Abu Dhabi)</option>
                    <option value="KSA">Saudi Arabia (Riyadh / Jeddah / Dammam)</option>
                    <option value="Qatar">Qatar (Doha / Lusail)</option>
                    <option value="Oman">Oman (Muscat / Sohar)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    City <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Dubai"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Address Line 1 <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address_line1}
                    onChange={e => setForm({ ...form, address_line1: e.target.value })}
                    placeholder="Street, building, warehouse number"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary block">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={form.address_line2}
                    onChange={e => setForm({ ...form, address_line2: e.target.value })}
                    placeholder="Suite, floor, landmark (optional)"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-primary block">
                  Order Notes
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Delivery instructions, preferred time window, etc. (optional)"
                  className="w-full bg-bg-primary border border-border rounded-xl p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent leading-relaxed resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Continue to Payment
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border-2 border-accent bg-accent-muted flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <Banknote size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary">Cash on Delivery</h3>
                    <span className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <Check size={11} className="text-white" />
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Pay in cash when your order arrives at your delivery address.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full border border-border bg-bg-surface hover:border-accent text-text-primary font-semibold text-sm transition-all"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Review Order
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Shipping To</h3>
                <div className="p-4 rounded-xl bg-bg-surface border border-border text-sm text-text-secondary space-y-1">
                  <p className="text-text-primary font-semibold">{form.customer_name}</p>
                  {form.company && <p>{form.company}</p>}
                  <p>{form.address_line1}{form.address_line2 ? `, ${form.address_line2}` : ''}</p>
                  <p>{form.city}, {form.country}</p>
                  <p>{form.email} &middot; {form.phone}</p>
                  {form.notes && <p className="text-xs text-text-muted pt-1">Notes: {form.notes}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Payment Method</h3>
                <div className="p-4 rounded-xl bg-bg-surface border border-border flex items-center gap-3 text-sm">
                  <Banknote size={18} className="text-accent" />
                  <span className="text-text-primary font-medium">Cash on Delivery</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Order Items</h3>
                <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                  {items.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 p-3.5 text-sm">
                      <div className="w-12 h-12 rounded-lg bg-bg-surface flex items-center justify-center p-1.5 shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-text-muted">Qty {item.qty} &times; {formatPrice(item.price, country)}</p>
                      </div>
                      <div className="font-semibold text-text-primary shrink-0">
                        {formatPrice(item.price * item.qty, country)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">Total</span>
                <span className="text-lg font-bold text-text-primary">{formatPrice(subtotal, country)}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full border border-border bg-bg-surface hover:border-accent disabled:opacity-50 text-text-primary font-semibold text-sm transition-all"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Not ready to order? <Link to="/cart" className="text-accent hover:text-accent-hover font-medium">Back to cart</Link>
        </p>
      </div>
    </>
  )
}
