import { AE, SA, QA, BH, KW, OM } from 'country-flag-icons/react/3x2'
import type { CountryCode } from '@/lib/countries'

const FLAGS: Record<CountryCode, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  ae: AE,
  sa: SA,
  qa: QA,
  bh: BH,
  kw: KW,
  om: OM,
}

interface CountryFlagProps {
  code: CountryCode
  className?: string
}

export default function CountryFlag({ code, className = 'w-4 h-3' }: CountryFlagProps) {
  const Flag = FLAGS[code]
  return <Flag className={`${className} rounded-[2px] object-cover shrink-0`} />
}
