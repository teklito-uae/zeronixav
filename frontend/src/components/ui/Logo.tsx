import logoSrc from '@/assets/logo/zeronixav-logo-light.png'

interface LogoProps {
  className?: string
}

export default function Logo({ className = 'h-7' }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="ZeroNix AV"
      className={`brand-logo w-auto object-contain shrink-0 ${className}`}
    />
  )
}
