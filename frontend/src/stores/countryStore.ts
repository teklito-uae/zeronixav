import { create } from 'zustand'
import { DEFAULT_COUNTRY, type CountryCode, COUNTRIES } from '@/lib/countries'

const STORAGE_KEY = 'zeronix-country'

function getInitialCountry(): CountryCode {
  if (typeof window === 'undefined') return DEFAULT_COUNTRY
  const stored = localStorage.getItem(STORAGE_KEY) as CountryCode | null
  return stored && COUNTRIES.some(c => c.code === stored) ? stored : DEFAULT_COUNTRY
}

interface CountryState {
  country: CountryCode
  setCountry: (country: CountryCode) => void
}

export const useCountryStore = create<CountryState>((set) => ({
  country: getInitialCountry(),
  setCountry: (country: CountryCode) => {
    localStorage.setItem(STORAGE_KEY, country)
    set({ country })
  },
}))
