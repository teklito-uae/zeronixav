import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, Bot, User, Sparkles, CheckCircle2, RefreshCw, ArrowRight, Layers, ShieldCheck } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import ProductCard from '@/components/ui/ProductCard'
import { useSolutionBuilderStore } from '@/stores/solutionBuilderStore'
import { api } from '@/lib/api'
import type { McpProduct, Product } from '@/types/api'

// Fallback recommendations if the AI/MCP endpoint isn't live yet
const MOCK_RECOMMENDATIONS: Product[] = [
  {
    id: 201,
    sku: 'YL-MVC840-AI',
    title: 'Yealink MVC840 Microsoft Teams Rooms Bundle (Pre-configured)',
    slug: 'yealink-mvc840-teams-room-system',
    brand: 'Yealink',
    description: 'Optimal recommendation for 15-25 person boardrooms using Microsoft Teams with ceiling microphone arrays.',
    price: '14850.00',
    stock: 24,
    category_id: 1,
    tech_specs: { Coverage: 'Up to 30 people', Certification: 'Microsoft Teams', Cameras: '4K Optical PTZ' },
    images: ['https://placehold.co/800x600/ECFDF5/059669?text=Yealink+MVC840']
  },
  {
    id: 202,
    sku: 'SHU-MXA920-AI',
    title: 'Shure MXA920 Steerable Ceiling Microphone Array',
    slug: 'shure-mxa920-ceiling-array-microphone',
    brand: 'Shure',
    description: 'Eliminates table boundary mics entirely, providing automated tracking across the executive table.',
    price: '21500.00',
    stock: 8,
    category_id: 4,
    tech_specs: { DSP: 'IntelliMix Auto-Tuning', Network: 'Dante PoE', Mounting: 'Flush Ceiling' },
    images: ['https://placehold.co/800x600/ECFDF5/059669?text=Shure+MXA920']
  }
]

export default function SolutionBuilderPage() {
  const { messages, isLoading, addMessage, setLoading, clearSession } = useSolutionBuilderStore()
  const [input, setInput] = useState('')
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, recommendedProducts])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userQuery = input.trim()
    setInput('')
    addMessage('user', userQuery)
    setLoading(true)

    try {
      const mcpResults = await api.get<McpProduct[]>('/api/mcp/products', { query: userQuery })

      if (mcpResults && mcpResults.length > 0) {
        const transformed: Product[] = mcpResults.map((m, idx) => ({
          id: 300 + idx,
          sku: m.sku,
          title: m.title,
          slug: m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brand: m.brand,
          description: `Recommended for: "${userQuery}". Compatible with ${m.compatible_services?.join(', ') || 'Dubai enterprise standards'}.`,
          price: 'Request Quote',
          stock: 15,
          category_id: 1,
          tech_specs: m.tech_specs || { Status: 'AI Recommended' },
          images: [`https://placehold.co/800x600/ECFDF5/059669?text=${encodeURIComponent(m.brand)}`]
        }))

        setRecommendedProducts(transformed)
        addMessage('assistant', `Based on what you described ("${userQuery}"), here's an optimized hardware list using tier-1 components. Every item below is ready for 24/7 Dubai deployment with full warranty backing.`)
      } else {
        setRecommendedProducts(MOCK_RECOMMENDATIONS)
        addMessage('assistant', `Here's our standard recommendation for your requirement: ("${userQuery}"). This combines a Yealink Microsoft Teams camera system with Shure ceiling microphones for crystal-clear boardroom audio.`)
      }
    } catch {
      setRecommendedProducts(MOCK_RECOMMENDATIONS)
      addMessage('assistant', `I've put together a certified hardware configuration for your space. Review the Yealink + Shure setup below and tap "Request Quote" to connect with our Dubai team.`)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText)
  }

  return (
    <>
      <SeoHead
        title="AI Room Configurator — ZeroNix AV Solutions | Dubai, UAE"
        description="Describe your space and get an instant AV hardware recommendation. Conversational AI configurator for meeting rooms, LED walls, and surveillance systems in Dubai."
        canonical="/solution-builder"
      />

      <div className="pt-20 sm:pt-[7.25rem] pb-24 max-w-6xl mx-auto px-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 border-b border-border mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-accent uppercase tracking-wider font-semibold mb-1.5">
              <Sparkles size={14} />
              <span>AI-Powered</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              AI Room Configurator
            </h1>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl">
              Describe your room size, platform (Microsoft Teams, Zoom, Dante), or signage needs — we'll instantly recommend a compatible hardware list from our Dubai catalog.
            </p>
          </div>

          <button
            onClick={() => { clearSession(); setRecommendedProducts([]); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-bg-surface hover:border-accent/40 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors self-start md:self-center shrink-0"
          >
            <RefreshCw size={13} />
            Start Over
          </button>
        </div>

        {/* Chat + Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chat Window */}
          <div className="lg:col-span-7 flex flex-col h-[600px] rounded-2xl border border-border bg-bg-raised overflow-hidden shadow-card">
            {/* Chat Top Banner */}
            <div className="px-5 py-4 border-b border-border bg-bg-surface flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                <Bot size={17} />
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">ZeroNix Room Assistant</div>
                <div className="text-[11px] text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Online — ready to help
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {messages.length === 0 ? (
                <div className="text-center py-12 px-6 space-y-6 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-full bg-accent-muted border border-accent/15 flex items-center justify-center text-accent mx-auto">
                    <Sparkles size={26} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-text-primary mb-1">
                      Let's find your AV setup
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Pick a quick example below, or type your own room details to get an instant hardware match.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 text-left">
                    {[
                      "We need a 20-person boardroom with Microsoft Teams Rooms and ceiling mics.",
                      "Quote an 85-inch 24/7 commercial 4K display with Crestron NVX distribution.",
                      "SIRA approved AI people-counting surveillance for a Dubai retail showroom."
                    ].map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickPrompt(promptText)}
                        className="w-full p-3.5 rounded-xl border border-border bg-bg-surface hover:border-accent/40 text-xs text-text-secondary hover:text-text-primary text-left transition-all flex items-center justify-between group"
                      >
                        <span className="line-clamp-1 pr-2">{promptText}</span>
                        <ArrowRight size={13} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-accent-muted border border-accent/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-accent text-white rounded-br-md'
                          : 'bg-bg-surface border border-border text-text-primary rounded-bl-md'
                      }`}
                    >
                      {m.content}
                    </div>

                    {m.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                        <User size={15} />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-3 items-center text-xs text-text-muted animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-accent-muted border border-accent/15 flex items-center justify-center text-accent">
                    <Bot size={15} />
                  </div>
                  <span>Matching your requirements to our catalog...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-bg-surface flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. 20-person boardroom with Shure ceiling mics & Teams certification..."
                disabled={isLoading}
                className="flex-1 bg-bg-primary border border-border rounded-full px-4 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Recommended Products Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-bg-raised space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-[11px] text-accent uppercase tracking-wider font-semibold">
                    Recommended
                  </span>
                  <h3 className="text-base font-bold text-text-primary">
                    Your Hardware List
                  </h3>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg-surface border border-border text-text-secondary">
                  {recommendedProducts.length} Items
                </span>
              </div>

              {recommendedProducts.length === 0 ? (
                <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-bg-surface/50">
                  <Layers size={26} className="text-text-muted mx-auto mb-3 opacity-50" />
                  <div className="text-xs font-medium text-text-secondary mb-1">
                    No recommendations yet
                  </div>
                  <p className="text-[11px] text-text-muted max-w-xs mx-auto">
                    Describe your requirement in the chat to generate an instant, compatible hardware list.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {recommendedProducts.map((prod) => (
                    <div key={prod.id || prod.sku} className="h-auto">
                      <ProductCard product={prod} />
                    </div>
                  ))}
                </div>
              )}

              {recommendedProducts.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Warranty:</span>
                    <span className="text-success font-medium">3-Year Dubai On-Site Warranty</span>
                  </div>

                  <Link
                    to="/contact?project=AI-Configured-Setup"
                    className="w-full py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Submit This List to Our Team</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Note Card */}
            <div className="p-5 rounded-2xl border border-border bg-bg-surface space-y-2 text-xs text-text-secondary">
              <div className="flex items-center gap-2 font-semibold text-text-primary">
                <ShieldCheck size={14} className="text-accent" />
                <span>Your Privacy Matters</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted">
                Configurator inquiries are handled by our Dubai engineering desk. No floorplans or project details are stored beyond your session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
