import { Fragment, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import type { Category } from '@/types/api'

interface BrandOption {
  id: number
  name: string
  slug: string
}

interface CatalogFiltersProps {
  categories: Category[]
  brands: BrandOption[]
  priceBounds: { min: number; max: number }
  selectedCategory: string | null
  selectedBrand: string | null
  priceMin: string
  priceMax: string
  onSelectCategory: (slug: string | null) => void
  onSelectBrand: (name: string | null) => void
  onPriceChange: (min: string, max: string) => void
  onClearAll: () => void
}

export default function CatalogFilters({
  categories,
  brands,
  priceBounds,
  selectedCategory,
  selectedBrand,
  priceMin,
  priceMax,
  onSelectCategory,
  onSelectBrand,
  onPriceChange,
  onClearAll,
}: CatalogFiltersProps) {
  const roots = categories.filter(c => !c.parent_id)
  const childrenOf = (parentId: number) => categories.filter(c => c.parent_id === parentId)

  const hasActiveFilters = Boolean(selectedCategory || selectedBrand || priceMin || priceMax)

  const boundsMin = Math.floor(priceBounds.min)
  const boundsMax = Math.ceil(priceBounds.max)
  const hasPriceRange = boundsMax > boundsMin

  const [range, setRange] = useState<[number, number]>([
    priceMin ? Number(priceMin) : boundsMin,
    priceMax ? Number(priceMax) : boundsMax,
  ])

  useEffect(() => {
    setRange([
      priceMin ? Number(priceMin) : boundsMin,
      priceMax ? Number(priceMax) : boundsMax,
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax, boundsMin, boundsMax])

  return (
    <div className="space-y-7">
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          <X size={13} />
          Clear all filters
        </button>
      )}

      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Category</h3>
        <div className="space-y-0.5">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              !selectedCategory ? 'text-accent font-semibold bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
            }`}
          >
            All Categories
          </button>
          {roots.map(root => (
            <Fragment key={root.id}>
              <button
                onClick={() => onSelectCategory(root.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === root.slug ? 'text-accent font-semibold bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}
              >
                {root.name}
              </button>
              {childrenOf(root.id).map(child => (
                <button
                  key={child.id}
                  onClick={() => onSelectCategory(child.slug)}
                  className={`w-full text-left pl-6 pr-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === child.slug ? 'text-accent font-semibold bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Brand</h3>
        <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectBrand(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              !selectedBrand ? 'text-accent font-semibold bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
            }`}
          >
            All Brands
          </button>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => onSelectBrand(brand.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                selectedBrand === brand.name ? 'text-accent font-semibold bg-accent-muted' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Price (AED)
        </h3>
        {hasPriceRange ? (
          <div className="px-1">
            <Slider
              min={boundsMin}
              max={boundsMax}
              step={Math.max(1, Math.round((boundsMax - boundsMin) / 100))}
              value={range}
              onValueChange={(value) => setRange(value as [number, number])}
              onValueCommit={(value) => onPriceChange(String(value[0]), String(value[1]))}
            />
            <div className="flex items-center justify-between mt-3 text-xs font-medium text-text-secondary">
              <span>AED {range[0].toLocaleString()}</span>
              <span>AED {range[1].toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="h-1.5 w-full rounded-full bg-bg-surface animate-pulse" />
        )}
      </div>
    </div>
  )
}
