import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, PackageSearch, Home } from 'lucide-react'
import SeoHead from '@/components/seo/SeoHead'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import CatalogFilters from '@/components/ui/CatalogFilters'
import { api } from '@/lib/api'
import type { Product, Category, PaginatedResponse } from '@/types/api'

interface BrandOption { id: number; name: string; slug: string }
interface PriceFilters { price_min: number; price_max: number }

/** Self + ancestor chain for a selected category slug, root-first. */
function getCategoryChain(categories: Category[], slug: string | null): Category[] {
  if (!slug) return []
  const target = categories.find(c => c.slug === slug)
  if (!target) return []
  const chain: Category[] = [target]
  let parentId = target.parent_id
  while (parentId) {
    const parent = categories.find(c => c.id === parentId)
    if (!parent) break
    chain.unshift(parent)
    parentId = parent.parent_id
  }
  return chain
}

/** Numbered page list with '...' gaps, e.g. [1, '...', 4, 5, 6, '...', 12]. */
function getPaginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 1) return [1]
  const delta = 1
  const range: (number | '...')[] = [1]
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)

  if (start > 2) range.push('...')
  for (let i = start; i <= end; i++) range.push(i)
  if (end < total - 1) range.push('...')
  range.push(total)

  return range
}

export default function ProductsCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const search = searchParams.get('search')
  const priceMin = searchParams.get('price_min') ?? ''
  const priceMax = searchParams.get('price_max') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    if (!('page' in updates)) next.delete('page')
    setSearchParams(next)
  }

  const { data: categoriesData } = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/api/v1/categories'),
    staleTime: 10 * 60 * 1000,
  })

  const { data: brandsData } = useQuery<{ brands: BrandOption[] }>({
    queryKey: ['brands'],
    queryFn: () => api.get<{ brands: BrandOption[] }>('/api/v1/brands'),
    staleTime: 10 * 60 * 1000,
  })

  const { data: priceFilters } = useQuery<PriceFilters>({
    queryKey: ['products-filters'],
    queryFn: () => api.get<PriceFilters>('/api/v1/products/filters'),
    staleTime: 10 * 60 * 1000,
  })

  const { data: productsData, isLoading, isError } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', category, brand, search, priceMin, priceMax, page],
    queryFn: () => api.get<PaginatedResponse<Product>>('/api/v1/products', {
      category: category ?? undefined,
      brand: brand ?? undefined,
      search: search ?? undefined,
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
      page,
    }),
    staleTime: 60 * 1000,
  })

  const priceBounds = useMemo(() => ({
    min: priceFilters?.price_min ?? 0,
    max: priceFilters?.price_max ?? 0,
  }), [priceFilters])

  const products = productsData?.data ?? []
  const meta = productsData?.meta

  const categoryChain = useMemo(
    () => getCategoryChain(categoriesData?.categories ?? [], category),
    [categoriesData, category]
  )
  const activeCategory = categoryChain[categoryChain.length - 1] ?? null
  const paginationRange = meta ? getPaginationRange(meta.current_page, meta.last_page) : []

  const filterProps = {
    categories: categoriesData?.categories ?? [],
    brands: brandsData?.brands ?? [],
    priceBounds,
    selectedCategory: category,
    selectedBrand: brand,
    priceMin,
    priceMax,
    onSelectCategory: (slug: string | null) => updateParams({ category: slug }),
    onSelectBrand: (name: string | null) => updateParams({ brand: name }),
    onPriceChange: (min: string, max: string) => updateParams({ price_min: min || null, price_max: max || null }),
    onClearAll: () => setSearchParams(new URLSearchParams()),
  }

  return (
    <>
      <SeoHead
        title="Shop All AV Products — ZeroNix AV Solutions"
        description="Browse ZeroNix AV's full catalog of enterprise audio-visual hardware — meeting room systems, digital signage, surveillance, and conferencing equipment across the GCC."
        canonical="/products"
      />

      <div className="pt-16">
        <section className="border-b border-border bg-bg-surface py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-6">
            {/* Dynamic breadcrumbs — reflect the selected category chain */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary mb-3">
              <Link to="/" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Home size={12} />
                Home
              </Link>
              <ChevronRight size={12} className="text-text-muted shrink-0" />
              {activeCategory || search ? (
                <Link to="/products" className="hover:text-accent transition-colors">Shop All Products</Link>
              ) : (
                <span className="text-text-primary font-medium">Shop All Products</span>
              )}
              {categoryChain.map((cat, i) => {
                const isLast = i === categoryChain.length - 1
                return (
                  <span key={cat.id} className="flex items-center gap-1.5">
                    <ChevronRight size={12} className="text-text-muted shrink-0" />
                    {isLast ? (
                      <span className="text-text-primary font-medium">{cat.name}</span>
                    ) : (
                      <button
                        onClick={() => updateParams({ category: cat.slug })}
                        className="hover:text-accent transition-colors"
                      >
                        {cat.name}
                      </button>
                    )}
                  </span>
                )
              })}
            </nav>

            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {activeCategory ? 'Category' : search ? 'Search Results' : 'Full Catalog'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1.5 tracking-tight">
              {activeCategory ? activeCategory.name : search ? `Results for "${search}"` : 'Shop All AV Products'}
            </h1>
            <p className="text-sm text-text-secondary mt-2 max-w-2xl">
              {activeCategory
                ? `Browsing ${activeCategory.name} — enterprise-grade hardware from Yealink, Shure, Crestron, Hikvision, Samsung, and more.`
                : search
                ? `Products matching "${search}" across our full catalog.`
                : 'Enterprise-grade hardware from Yealink, Shure, Crestron, Hikvision, Samsung, and more — filter by category, brand, or budget.'}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <CatalogFilters {...filterProps} />
              </div>
            </aside>

            {/* Results */}
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <p className="text-sm text-text-secondary">
                  {meta ? <><span className="font-semibold text-text-primary">{meta.total}</span> products</> : 'Loading products…'}
                </p>
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-bg-surface text-text-secondary text-xs font-semibold"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : isError ? (
                <div className="p-10 rounded-2xl border border-border bg-bg-surface text-center text-text-secondary text-sm">
                  We couldn't load the catalog right now. Please refresh the page or check back shortly.
                </div>
              ) : products.length === 0 ? (
                <div className="p-14 rounded-2xl border border-border bg-bg-surface text-center">
                  <PackageSearch className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-secondary">No products match these filters.</p>
                  <button
                    onClick={filterProps.onClearAll}
                    className="mt-4 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                  </div>

                  {meta && meta.last_page > 1 && (
                    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-10">
                      <button
                        onClick={() => updateParams({ page: String(page - 1) })}
                        disabled={page <= 1}
                        className="p-2 rounded-full border border-border bg-bg-surface text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {paginationRange.map((entry, i) =>
                        entry === '...' ? (
                          <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-text-muted select-none">
                            …
                          </span>
                        ) : (
                          <button
                            key={entry}
                            onClick={() => updateParams({ page: String(entry) })}
                            aria-current={entry === meta.current_page ? 'page' : undefined}
                            className={`min-w-[2.25rem] h-9 px-2 rounded-full text-xs font-semibold transition-colors ${
                              entry === meta.current_page
                                ? 'bg-accent text-white'
                                : 'border border-border bg-bg-surface text-text-secondary hover:border-accent hover:text-accent'
                            }`}
                          >
                            {entry}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => updateParams({ page: String(page + 1) })}
                        disabled={page >= meta.last_page}
                        className="p-2 rounded-full border border-border bg-bg-surface text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Dialog.Root open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 h-full w-full max-w-xs bg-bg-primary border-r border-border shadow-2xl flex flex-col lg:hidden focus:outline-none">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <Dialog.Title className="text-sm font-bold text-text-primary">Filters</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <CatalogFilters {...filterProps} />
            </div>
            <div className="p-5 border-t border-border shrink-0">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors"
              >
                Show Results
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
