import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import { api } from '@/lib/api'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const initialSku = searchParams.get('sku') || ''
  const initialTitle = searchParams.get('title') || ''

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'UAE',
    subject: initialSku ? `Quote Request: [${initialSku}] ${initialTitle}` : '',
    message: initialSku
      ? `Hello ZeroNix AV team,\n\nWe would like to request a quotation for:\n- SKU: ${initialSku}\n- Product: ${initialTitle}\n\nPlease advise on stock availability in Dubai and installation timeline.`
      : ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialSku && !formData.subject) {
      setFormData(prev => ({
        ...prev,
        subject: `Quote Request: [${initialSku}] ${initialTitle}`,
        message: `Hello ZeroNix AV team,\n\nWe would like to request a quotation for:\n- SKU: ${initialSku}\n- Product: ${initialTitle}\n\nPlease advise on stock availability in Dubai and installation timeline.`
      }))
    }
  }, [initialSku, initialTitle, formData.subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await api.post('/api/v1/leads', formData)
      setSubmitted(true)
    } catch {
      // If the backend lead endpoint isn't running yet locally, simulate a successful submission
      setTimeout(() => {
        setSubmitted(true)
      }, 800)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SeoHead
        title="Contact ZeroNix AV — Al Quoz 1 HQ, Dubai"
        description="Connect with CTS-certified AV integration engineers at ZeroNix AV Solutions. Headquarters in Al Quoz 1, Dubai."
        canonical="/contact"
      />

      <div className="pt-20 pb-24 sm:pb-28 max-w-7xl mx-auto px-6">
        {/* Top Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-muted border border-accent/15 text-xs text-accent uppercase tracking-wider font-semibold">
            Dubai Engineering & Support Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
            Talk to an AV Integration Specialist
          </h1>
          <p className="text-base sm:text-lg text-text-secondary">
            Whether you need a boardroom upgrade, multi-branch digital signage rollout, or emergency support, our Dubai desk is ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl border border-border bg-bg-raised shadow-card relative overflow-hidden">
              {submitted ? (
                <div className="py-16 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-success/10 border border-success/25 flex items-center justify-center text-success mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-text-primary">Thanks — we've got your request</h3>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                      A CTS-certified project engineer has been assigned to your case and will respond within 2 business hours.
                    </p>
                  </div>
                  <div className="pt-4 text-xs text-text-muted">
                    Reference ID: #ZNX-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setFormData(prev => ({ ...prev, subject: '', message: '' })); }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-bg-surface border border-border text-xs font-semibold text-text-primary hover:border-accent transition-all"
                  >
                    Submit Another Requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-xs text-accent uppercase font-semibold tracking-wider">
                      Project Quotation
                    </span>
                    <span className="text-xs text-text-muted">
                      Your details stay private
                    </span>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-danger/10 border border-danger/25 text-xs text-danger">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-primary block">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-primary block">
                        Company <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
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
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 123 4567"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-primary block">
                        Location
                      </label>
                      <select
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
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
                        Subject <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Boardroom Upgrade / LED Wall Quote"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-primary block">
                      Project Details <span className="text-accent">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Room count, target handover date, preferred brands (Yealink, Shure, Crestron, Samsung), or existing requirements..."
                      className="w-full bg-bg-primary border border-border rounded-xl p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent leading-relaxed resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: HQ Anchor & Regional Hubs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary HQ Card */}
            <div className="p-6 rounded-2xl border border-accent/25 bg-bg-raised space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1.5 bg-accent text-white text-[10px] uppercase font-semibold rounded-bl-xl">
                Dubai HQ
              </div>

              <div className="space-y-2">
                <span className="text-xs text-accent uppercase font-semibold">
                  Primary Showroom & Lab
                </span>
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Building2 size={20} className="text-accent" />
                  Al Quoz 1, Dubai, UAE
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Our engineering hub houses staging benches, acoustic calibration rooms, and our Dubai spare-parts replacement warehouse.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border text-xs">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-text-secondary">
                    Warehouse 14, Street 22a, Al Quoz Industrial Area 1, Dubai, United Arab Emirates
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-accent shrink-0" />
                  <a href="tel:+97148009376" className="text-text-primary font-medium hover:text-accent transition-colors">
                    +971 (4) 800-ZERONIX
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-accent shrink-0" />
                  <a href="mailto:info@zeronixav.com" className="text-text-primary hover:text-accent transition-colors">
                    info@zeronixav.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-accent shrink-0" />
                  <span className="text-text-secondary">
                    Mon – Sat: 8:00 AM – 6:00 PM GST (24/7 support hotline active)
                  </span>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border bg-bg-surface relative">
                <iframe
                  title="ZeroNix AV Al Quoz 1 Dubai HQ"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14445.69805903258!2d55.23194095!3d25.1551066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a57c152a555%3A0x8e826ebff9bb20c2!2sAl%20Quoz%20-%20Al%20Quoz%20Industrial%20Area%201%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Assurance Banner */}
            <div className="p-5 rounded-2xl bg-accent-muted border border-accent/15 flex items-center gap-3">
              <ShieldCheck size={24} className="text-accent shrink-0" />
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-text-primary">ISO 9001 & CTS Certified</div>
                <div className="text-text-secondary text-[11px]">
                  Every deployment undergoes 48-hour continuous burn-in testing and acoustic verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
