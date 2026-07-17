import { useEffect, useRef, useState } from 'react'

/**
 * Reports once a ref'd element first enters the viewport (plus `rootMargin`
 * lookahead), then disconnects — used to defer per-section API calls until
 * the user actually scrolls near them instead of firing on mount.
 */
export function useInView<T extends HTMLElement>(rootMargin = '400px') {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isInView, rootMargin])

  return { ref, isInView }
}
