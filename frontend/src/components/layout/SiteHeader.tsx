import { useEffect, useState } from 'react'
import TopBar from './TopBar'
import Navbar from './Navbar'

export default function SiteHeader() {
  const [topBarVisible, setTopBarVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setTopBarVisible(window.scrollY < 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`hidden sm:block overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          topBarVisible ? 'max-h-9 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <TopBar />
      </div>
      <Navbar />
    </div>
  )
}
