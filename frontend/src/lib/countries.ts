export type CountryCode = 'ae' | 'sa' | 'qa' | 'bh' | 'kw' | 'om'

export interface Country {
  code: CountryCode
  name: string
  isoCode: string
  currencyCode: string
  currencySymbol: string
  rateToAed: number
}

export const COUNTRIES: Country[] = [
  { code: 'ae', name: 'United Arab Emirates', isoCode: 'AE', currencyCode: 'AED', currencySymbol: 'AED', rateToAed: 1 },
  { code: 'sa', name: 'Saudi Arabia',         isoCode: 'SA', currencyCode: 'SAR', currencySymbol: 'SAR', rateToAed: 1.02 },
  { code: 'qa', name: 'Qatar',                isoCode: 'QA', currencyCode: 'QAR', currencySymbol: 'QAR', rateToAed: 0.99 },
  { code: 'bh', name: 'Bahrain',               isoCode: 'BH', currencyCode: 'BHD', currencySymbol: 'BHD', rateToAed: 0.102 },
  { code: 'kw', name: 'Kuwait',                isoCode: 'KW', currencyCode: 'KWD', currencySymbol: 'KWD', rateToAed: 0.083 },
  { code: 'om', name: 'Oman',                  isoCode: 'OM', currencyCode: 'OMR', currencySymbol: 'OMR', rateToAed: 0.105 },
]

export const DEFAULT_COUNTRY: CountryCode = 'ae'

export function getCountry(code: string): Country {
  return COUNTRIES.find(c => c.code === code) ?? COUNTRIES[0]
}
