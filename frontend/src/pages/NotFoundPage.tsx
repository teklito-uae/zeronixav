import { Link } from 'react-router-dom'
import { ArrowRight, Home, Compass } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'

export default function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found — ZeroNix AV Solutions"
        description="The page you're looking for doesn't exist or has moved."
        noindex
      />

      <div className="min-h-[70vh] flex items-center justify-center px-6 pt-16">
        <div className="text-center max-w-md space-y-6">
          <div className="w-16 h-16 rounded-full bg-accent-muted border border-accent/15 flex items-center justify-center text-accent mx-auto">
            <Compass size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">404</h1>
            <p className="text-sm text-text-secondary">
              We couldn't find the page you were looking for. It may have moved, or the link might be outdated.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all"
            >
              <Home size={15} />
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-bg-surface hover:border-accent text-text-primary text-sm font-semibold transition-all"
            >
              Contact Us
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
