import { getCountry } from '@/lib/countries'

export function formatPrice(priceInAed: number, countryCode: string): string {
  if (priceInAed <= 0) return 'Request Quote'

  const country = getCountry(countryCode)
  const converted = priceInAed * country.rateToAed

  return `${country.currencySymbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
