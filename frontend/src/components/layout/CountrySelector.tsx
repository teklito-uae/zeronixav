import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import { useCountryStore } from '@/stores/countryStore'
import CountryFlag from '@/components/ui/CountryFlag'

export default function CountrySelector() {
  const { country, setCountry } = useCountryStore()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find(c => c.code === country) ?? COUNTRIES[0]

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label="Select region"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm font-medium rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
      >
        <CountryFlag code={selected.code} />
        <span className="hidden sm:inline">{selected.code.toUpperCase()}</span>
        <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 pt-2 w-56 z-10">
          <div className="rounded-2xl border border-border bg-bg-raised shadow-card p-2">
            <span className="block px-3 pt-1.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Ship to / Currency
            </span>
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                onClick={() => { setCountry(c.code); setIsOpen(false) }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  c.code === country
                    ? 'text-accent bg-accent-muted font-semibold'
                    : 'text-text-secondary hover:text-accent hover:bg-accent-muted'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CountryFlag code={c.code} />
                  {c.isoCode}
                </span>
                <span className="text-[11px] font-mono text-text-muted">{c.currencyCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
