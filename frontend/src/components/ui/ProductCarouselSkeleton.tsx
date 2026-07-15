import ProductCardSkeleton from './ProductCardSkeleton'

interface ProductCarouselSkeletonProps {
  count?: number
}

export default function ProductCarouselSkeleton({ count = 5 }: ProductCarouselSkeletonProps) {
  return (
    <div className="relative w-full py-2">
      <div className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex -ml-4 sm:-ml-5">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="min-w-0 pl-4 sm:pl-5 flex-[0_0_78%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
            >
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
