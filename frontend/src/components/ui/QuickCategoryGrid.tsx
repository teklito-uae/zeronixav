import { Link } from 'react-router-dom'
import conferenceCameras from '@/assets/categories/conference-cameras-2.webp'
import videoWalls from '@/assets/categories/DS-D6055UN-D_S_image_4.png'
import headsets from '@/assets/categories/headsets-2.webp'
import ceilingSpeakers from '@/assets/categories/JBLCEILINGSPEAKERCONTROL12C-VAWHITE.jpg'
import microphones from '@/assets/categories/microphones-2.webp'
import speakers from '@/assets/categories/speakers-2.webp'
import ipPhones from '@/assets/categories/w4100i-gallery1.avif'
import amplifiers from '@/assets/categories/wiim-amp-1.webp'

interface QuickCategory {
  label: string
  image: string
  to: string
}

const QUICK_CATEGORIES: QuickCategory[] = [
  { label: 'Conference Solutions', image: conferenceCameras, to: '/products?category=conference-room' },
  { label: 'Digital Signage', image: videoWalls, to: '/products?search=Signage' },
  { label: 'Headsets', image: headsets, to: '/products?category=professional-audio' },
  { label: 'Speakers', image: ceilingSpeakers, to: '/products?search=Speaker' },
  { label: 'Microphones', image: microphones, to: '/products?search=Microphone' },
  { label: 'Speakers', image: speakers, to: '/products?category=professional-audio' },
  { label: 'Projectors', image: ipPhones, to: '/products?search=Projectors' },
  { label: 'Amplifiers', image: amplifiers, to: '/products?search=Amplifier' },
]

export default function QuickCategoryGrid() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
      {QUICK_CATEGORIES.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="group flex flex-col items-center text-center gap-1.5 sm:gap-2 rounded-md border border-border bg-bg-surface hover:border-accent/40 hover:bg-bg-raised transition-colors p-1.5 sm:p-2 pb-2.5 sm:pb-3"
        >
          <div className="w-full aspect-square rounded-sm bg-zinc-100 dark:bg-white/[0.06] flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={item.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain p-2.5 sm:p-3 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="min-h-[2.2em] flex items-center justify-center text-[10px] sm:text-xs font-semibold text-text-primary leading-tight line-clamp-2 px-0.5">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  )
}
