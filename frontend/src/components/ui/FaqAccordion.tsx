import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ServiceFaq } from '@/types/api'

interface FaqAccordionProps {
  faqs: ServiceFaq[]
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id
        return (
          <div
            key={faq.id}
            className="rounded-2xl border border-border bg-bg-raised overflow-hidden transition-colors data-[open=true]:border-accent/40"
            data-open={isOpen}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
            >
              <span className="text-sm sm:text-base font-semibold text-text-primary">
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
