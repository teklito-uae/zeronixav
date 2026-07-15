import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import MobileTabBar from './MobileTabBar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary overscroll-none">
      <SiteHeader />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  )
}
